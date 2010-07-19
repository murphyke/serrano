from django.db.models.query_utils import Q

from avocado.modeltree import ModelTree, DEFAULT_MODEL_TREE
from avocado.fields.models import ModelField
from avocado.fields.cache import cache
from avocado.fields.operators import FIELD_LOOKUPS

class AmbiguousField(Exception):
    pass


class M(Q):
    # a reference to a modeltree instance is set, so that it can be dynamically
    # changed at runtime
    modeltree = DEFAULT_MODEL_TREE
    
    def __init__(self, modeltree=None, **kwargs):
        modeltree = modeltree or self.modeltree
        if not isinstance(modeltree, ModelTree):
            raise RuntimeError, 'A ModelTree instance required'

        nkwargs = {}
        for key, value in kwargs.items():
            toks = key.split('__')
            
            field_id = app_name = model_name = field_name = operator = None
            
            # set operator if exists
            if len(toks) > 1:
                if FIELD_LOOKUPS.match(toks[-1]):
                    operator = toks.pop(-1)
            
            # field_id or field_name
            tok = toks.pop(-1)
            if tok.startswith('_'):
                field_id = int(tok[1:])
            else:
                field_name = tok
            
            # model_name
            if len(toks) == 1:
                model_name = toks[0]
            # app_name and model_name
            elif len(toks) == 2:
                app_name, model_name = toks
                
    
            field = self._get_field(field_id, app_name, model_name, field_name)

            skey = field.query_string(operator, self.modeltree)
            nkwargs[skey] = value

        return super(M, self).__init__(**nkwargs)
    
    def _get_field(self, field_id=None, app_name=None, model_name=None, field_name=None):
        if field_id or (app_name and model_name):
            return cache.get(field_id=field_id, app_name=app_name, model_name=model_name,
                field_name=field_name)

        # non-optimized lookup that can result in multiple objects returned
        try:
            return ModelField.objects.get(field_name=field_name)
        except ModelField.MultipleObjectsReturned:
            raise AmbiguousField, 'Ambiguous field "%s"'
