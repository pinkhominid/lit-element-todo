# LitElement TodoMVC Example

## Learnings

* Mimic built-in html elements
  * Attrs/props in, events out
  * Naming too e.g. todo-list, todo-item, todo-form
* Shorthand type no longer supported for props e.g. _todos: Array
* Must call super first in a constructor
* _abc is "protected"
* Computed props as getters or just compute in render()
* Use <slot> effectively
* Consider reflect:true to keep attrs updated
* Use object spread to keep render templates concise
* Auto update mechanism expects immutable props
* Default type for properties is String
* Double quotes in template attrs are only needed when value has spaces
* Most element templates should style :host {display: block;}
* Elements should "work" on their own
* Don't use superflous elements in your templates
* Allow styling of shadow dom elements with css variables
* Dispatch events after updating the state of an element
* Prefer all lower-case for custom event names
* Be careful not to override user settings when setting props and attrs on the root
* For checkboxes prefer the property .checked over attr ?checked
