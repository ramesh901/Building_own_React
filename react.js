const createVDOM = (element, id = '.') => {
  const newElement = {
    type: element.type,
    props: element.props,
    id
  }
  if (!element.children) {
    newElement.children = []
  } else {

    newElement.children = element.children.map((child, index) => {
      if (typeof child === 'object') {
        return createVDOM(child, `${id}${index}.`)
      } else {
        return child
      }
    })
  }
  return newElement
}

/*element is an object with three properties. Those three properties used within
createVDOM function so give object as input with three properties */
const vdom = createVDOM({type:'div',props:{},children:[]})
console.log('vdom = ',vdom)
