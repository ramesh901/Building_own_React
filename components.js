const h = (typeval, props = {}, children = []) => ({
  typeval,
  props,
  children
})

const ListHeadComponent = (list) => {
  let children = list.map(content => {
    console.log('<ListHeadComponent> content = ', content)
    return ListItemComponent(content)
  })
  return h('ul', { id: 'list' }, children)
}

const ListItemComponent = content => {
  console.log('<ListItemComponent> content = ', content)
  return h('li', {}, [content])
}

const RootComponent1 = (list) => {
  console.log('<RootComponent1> list = ', list)
  return h('div', {}, [ ListHeadComponent(list) ])
}

const WelcomeComponent = ({ name }) => h('div', {}, ['Welcome ' + name]);

const RootComponent2 = ({ user }) => {  
  if (user) {
    // The vDOM node's type can also be another
    // component. React calls it automatically when creating
    // the vDOM tree
    return WelcomeComponent({ name: user });
  } else {
    return h('div', {}, [`Please, Log in`]);
  }
}

const a = h(
  "ul",
  { "class": "list" },
  [h(
    "li",
    null,
    "item 1"
  ),
  h(
    "li",
    null,
    "item 2"
  )]
);

const b = h(
  "ul",
  { "class": "list" },
  []
);
