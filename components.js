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
/*
const RootComponent = (list) => {
  console.log('<RootComponent> list = ', list)
  return h('div', {}, [ ListHeadComponent(list) ])
}*/
