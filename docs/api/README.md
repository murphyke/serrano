# Serrano API specification notes

serrano-api.yaml is a Swagger API specification for Serrano.

serrano-api.html is a derived static HTML rendering of the specification, produced via:

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
### About editing the spec

Swagger has an OpenAPI editor at http://editor.swagger.io/#/, but I found it somewhat annoying to use, even after I installed it locally, so I gravitated to working in my regular editor and validating with `swagger validate serrano-api.yaml`. The latter tool can be installed via `npm install -g swagger-cli`.

### Alternative

Note: the above is an alternative to the also-seen `swagger-codegen generate -l html -c your_config.json -i serrano-api.yaml -o serrano-api-html`. Unfortunately, the latter tool generates ugly HTML, whether you use the `html`, `html2`, or `dynamic-html` flavors. It's really too bad that the Swagger editor uses its own (far superior) way of generating HTML. One of the reasons why the swagger-codegen HTML is awkward is that it documents the auto-generated code API, not REST API per se.
