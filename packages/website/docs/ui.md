---
{
  "order": 4,
  "title": "UI"
}
---

# UI

## Using the Preact component library

`@create-figma-plugin/ui` is a library of production-grade [Preact](https://preactjs.com) components that replicate the Figma/FigJam editor’s UI design.

[![UI components from `@create-figma-plugin/ui`: Button, File Upload Dropzone, Textbox Numeric, Textbox Autocomplete, Checkbox, Selectable Item, Segmented Control](<%- media['ui-figma-components'] %>)](<%- baseUrl %>storybook/)

See the [full library of components in the Storybook](<%- baseUrl %>storybook/).

The component library ships with two themes, one for Figma and one for FigJam. Components will automatically render using the Figma theme if the UI is launched from a Figma plugin, and the FigJam theme if the UI is launched from a FigJam plugin/widget.

![UI of the Insert Big Image plugin rendered using the Figma and FigJam themes](<%- media['ui-themes'] %>)

To install, do:

```sh
$ npm install @create-figma-plugin/ui preact
```

Then, include a call to [`showUI`](<%- query('page', 'utilities').url %>#showuidataoptions--data) in your plugin/widget’s main entry point.

Consider a toy Figma plugin:

```ts
// src/main.ts

import { showUI } from '@create-figma-plugin/utilities'

export default function () {
  const options = { width: 240, height: 120 }
  const data = { greeting: 'Hello, World!' }
  showUI(options, data)
}
```

`showUI` takes two arguments, and the second `data` argument is useful for passing some initializing data to the UI.

Next, create a file for our UI (eg. `src/ui.tsx`):

```tsx
// src/ui.tsx

import { render, Container, Text, VerticalSpace } from '@create-figma-plugin/ui'
import { h } from 'preact'

function Plugin (props: { greeting: string }) {
  return (
    <Container space='medium'>
      <VerticalSpace space='medium' />
      <Text>{props.greeting}</Text>
      <VerticalSpace space='medium' />
    </Container>
  )
}

export default render(Plugin)
```

See that:

- `render` takes a single argument, `Plugin`, which is a [Preact functional component](https://preactjs.com/guide/v10/components#functional-components).
- The `props` received by the `Plugin` component is precisely the `data` object that was passed to `showUI` from the plugin/widget’s main entry point.

Finally, in `package.json`, point to our UI file on the [**`"ui"`**](<%- query('page', 'configuration').url %>#ui) key under **`"figma-plugin"`**:

```json {7}
{
  // ...
  "figma-plugin": {
    // ...
    "name": "Hello World",
    "main": "src/main.ts",
    "ui": "src/ui.tsx"
  }
}
```

When we rebuild our plugin and run it, we’ll see:

![Figma plugin UI modal with “Hello, World” text](<%- media['ui-hello-world-figma'] %>)

See the [Storybook](<%- baseUrl %>storybook/) for the full library of Preact components, and the [recipe for passing data between the plugin/widget’s main and UI contexts](<%- query('page', 'recipes').url %>#passing-data-between-the-plugin-widgets-main-and-ui-contexts).

## Using React

When building your plugin/widget, the `build-figma-plugin` CLI will detect and automatically swap out all `react` and `react-dom` imports with [`preact/compat`](https://preactjs.com/guide/v10/switching-to-preact/). This means that it’s possible to seamlessly use React components alongside the Preact components from the `@create-figma-plugin/ui` library.

(If you still prefer to bundle React rather than Preact, see the [recipe to disable the automatic swapping of React imports](<%- query('page', 'recipes').url %>#disabling-automatic-swapping-of-react-imports).)

To use React components in your UI, ensure that `react` and `@types/react` are installed:

```sh
$ npm install --save-dev react @types/react
```

For a runnable example, try the [`react-editor`](https://github.com/yuanqing/create-figma-plugin/tree/main/packages/create-figma-plugin/templates/plugin/react-editor) plugin template:

```sh
$ npx --yes create-figma-plugin --template plugin/react-editor
```

## Using custom CSS

Out of the box, the `build-figma-plugin` CLI supports [CSS Modules](https://github.com/css-modules/css-modules):

```css
/* src/styles.css */

.container {
  background-color: var(--color-silver);
}
```

```tsx
// src/ui.tsx

import { render } from '@create-figma-plugin/ui'
import { h } from 'preact'
import styles from './styles.css'

function Plugin () {
  // ...
  return (
    <div class={styles.container}>
      {/* ... */}
    </div>
  )
}

export default render(Plugin)
```

By default, all the class names in CSS files imported via an `import` statement (as in the above example) will be hashed. This is to ensure that [each class name is globally unique](https://github.com/css-modules/css-modules#implementations).

To directly “inline” a CSS file in your UI *without* hashing its class names, add a `!` prefix to the import path:

```tsx
// src/ui.tsx

import { render } from '@create-figma-plugin/ui'
import { h } from 'preact'
import '!./styles.css'

function Plugin () {
  // ...
  return (
    <div class="container">
      {/* ... */}
    </div>
  )
}

export default render(Plugin)
```

Refer to the [`base.css`](https://github.com/yuanqing/create-figma-plugin/blob/main/packages/ui/src/css/base.css) file in `@create-figma-plugin/ui` for the list of CSS variables that are available for use in your custom CSS.

## Using a custom UI library

To use a custom UI library instead of `@create-figma-plugin/ui`, write your UI implementation as follows:

```ts
// src/ui.ts

export default function (rootNode: HTMLElement, data: { greeting: string }) {
  rootNode.innerHTML = `<p>${data.greeting}</p>` //=> <p>Hello, World!</p>
}
```

The exported function receives two arguments:
- `rootNode` — An empty `<div>` element within which you can render your UI.
- `data` — This corresponds to the `data` object that was passed to `showUI` from the plugin/widget’s main entry point.
