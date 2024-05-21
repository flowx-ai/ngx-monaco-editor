# ngx-monaco-editor for FlowX.AI


This module is based on original ngx-monaco-editor



## 1. Intercept JSON tokens related to FlowX:

The folder `assets/monaco-editor/dev/vs/language/json` contains the modified language that accept as valid the following type of json code


```json
{
  "app": {
    "valid": ${app.valid}
  }
}
```

All the modifications based on bazed libraries are marked with `//FLOWX-UPGRADE` comment


## 2. Provide intellisence for process datamodel

The component was modified with the following input property `dataModel` which can receive the entire datamodel from the process.

Once the datamodel is received this is parsed inside the monaco-editor component using the following functions: `flattenNestedObjects` and `groupByParent` the outpul looks like:

```json
{
    "root": [
        {
            "key": "application",
            "type": "OBJECT",
            "description": null,
            "useInReporting": false
        }
    ],
    "application": [
        {
            "key": "generateInterface",
            "parent": "application",
            "type": "OBJECT",
            "description": null,
            "useInReporting": false
        }
    ],
    "application.generateInterface": [
        {
            "key": "titleOfForm",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "firstName",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "middleInitial",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "lastName",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "emailAddress",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "homeStreetAddress",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "aptDropdown",
            "parent": "application.generateInterface",
            "type": "ENUM",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "city",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "stateDropdown",
            "parent": "application.generateInterface",
            "type": "ENUM",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "zipCode",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "homePhone",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "timeAtCurrentAddressYears",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "timeAtCurrentAddressMonths",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "housingStatusDropdown",
            "parent": "application.generateInterface",
            "type": "ENUM",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "socialSecurityNumber",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "dateOfBirth",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "driversLicenseLast4",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "saveButton",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        },
        {
            "key": "cancelButton",
            "parent": "application.generateInterface",
            "type": "STRING",
            "description": null,
            "useInReporting": false
        }
    ]
}
```

the model is registered using `registerIntelliSense` based on inputlanguage


## 3. Format the code for language

The component has a public function that can be called to format the code. 
By default the formatter works for couple of language, in order to format the code for java, python, groovy etc you need to provide a language server
Examples :

* https://github.com/TypeFox/monaco-languageclient

* https://langserver.org/

There is also a posibility to use prettier in node.js and send the code to server and format it.