# Serrano API specification notes

## RAML

After trying out Swagger/OpenAPI 2.0, I switched to RAML, because OpenAPI was not capable of describing our current API. RAML may ultimately lose in the war with OpenAPI, but at the moment, it is much more capable of documenting complicated, real-world APIs.

### Validation

To validate a RAML spec, you can do one of two things:

1. Download and use the open-source [Mulesoft API Designer](https://github.com/mulesoft/api-designer). This is a web app that allows the editing of RAML and displays documentation from it.  Note that this documentation is not downloadable.

2. Install `raml-cop` (`npm install -g raml-cop`) and run it on the spec.

### Documentation

There are two open-source options for generating documentation from RAML code:

* [raml2html](https://github.com/kevinrenskers/raml2html)
* [php-raml2html](https://github.com/mikestowe/php-raml2html)

### JSON Schemas

RAML is not capable of describing the Serrano API all by itself, but luckily it can delegate to bits written in JSON Schema. The JSON schemas incorporated so far are for the context and view objects, held in the serrano.context.schema.json and serrano.view.schema.json files, respectively. These can be tested by doing:

`npm install && npm test`


## Obsolete original notes about using Swagger

With Swagger 2.0, I found that the best static HTML rendering of an API was provided by bootprint:

```
npm install -g bootprint
npm install -g bootprint-openapi
npm install -g bootprint-swagger
# For making a single-page HTML file:
npm -g install html-inline

# Place output in serrano-api-html directory:
bootprint swagger serrano-api.yaml tmp
# Create a single HTML file:
html-inline tmp/index.html > serrano-api.html
rm tmp
```
### About editing Swagger code

Swagger has an OpenAPI editor at http://editor.swagger.io/#/, but I found it somewhat annoying to use, even after I installed it locally, so I gravitated to working in my regular editor and validating with `swagger validate serrano-api.yaml`. The latter tool can be installed via `npm install -g swagger-cli`.

### The Swagger way to produce documentation

Swagger 2.0 only has a way to document generated APIs, not the API itself. To use this approach, do `swagger-codegen generate -l html -c your_config.json -i serrano-api.yaml -o serrano-api-html`. Unfortunately, the latter tool generates ugly HTML, whether you use the `html`, `html2`, or `dynamic-html` flavors. It's really too bad that the Swagger editor uses its own (far superior) way of generating HTML. As mentioned, one of the reasons why the swagger-codegen HTML is awkward is that it documents the auto-generated code API, not REST API per se.

