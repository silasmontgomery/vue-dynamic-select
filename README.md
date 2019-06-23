# vue-dynamic-select
A VueJS plugin that provides a searchable and reactive select list component with no dependencies.

![alt text](https://raw.githubusercontent.com/silasmontgomery/vue-dynamic-select/master/src/images/dynamic-select.png "vue-dynamic-select screenshot")

[View Online Demos Here](http://demos.reticent.net/vue-dynamic-select)

### Installation
```
npm install vue-dynamic-select --save
```

### Import
```javascript
import DynamicSelect from 'vue-dynamic-select'

Vue.use(DynamicSelect)
```

### Usage
```javascript
// Static options source (array)
<dynamic-select 
    :options="objectArray"
    option-value="id"
    option-text="name"
    placeholder="type to search"
    v-model="selectedObject" />

// Dynamic options source (ajax, etc)
<dynamic-select 
    :options="objectArray"
    @search="onSearchEventHandler"
    option-value="id"
    option-text="name"
    placeholder="type to search"
    v-model="selectedObject" />
```

NOTE: For more detailed usage see the examples folder.

### Properties
| Name         | Type   | Default | Description                         |
| ------------ | ------ | ------- | ------------------------------------------------------------------- |
| options      | Array  | [ ]     | Array of objects that will create the select list options           |
| option-value | String | id      | The object property used for the value of the select options        |
| option-text  | String | name    | The object property used for the display text of the select options |
| v-model      | Object | null    | Object containing the the selected object                           |
| placeholder  | String | search  | String containing the text to be used as a placeholder              |

### Events
| Name   | Description                                                                 |
| ------ | --------------------------------------------------------------------------- |
| search | Triggered whenever search text changes. Value is the current search string. |
| input  | Triggered whenever an option is selected.                                   |
