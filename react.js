const createVDOM = (element, id = '.') => {
  const newElement = {
    typeval: element.typeval,
    props: element.props,
    id // id is part of newElement and not comes from element.
  }
  console.log('new element in createVDOM is', newElement)
  console.log('new element children', newElement.children)
  console.log('element children', element.children)
  if (!element.children) {
    newElement.children = []
  } else if (typeof element.children === 'string') {
    newElement.children = [element.children]
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

const diff = (
  left,
  right,
  patches,
  parent = null
) => {
  // If the left side (i.e. current vDOM) node does not exist,
  // we have to create it.
  // console.log("left and right",left.typeval,right.typeval)
  if (!left) {
    console.log('left is null')
    patches.push({
      parent, // We pass in the parent of the left side node
              // so we know whether to attach the newly create descendants
      type: 'PATCH_CREATE_NODE',
      node: right // And of course we pass in the newly created node
    })
  } else if (!right) {
    // If the right side (i.e. the new vDOM) node doesn't exist,
    // we need to remove the node from the vDOM
    patches.push({
      type: 'PATCH_REMOVE_NODE',
      node: left // We just need to pass in the node to remove
    })
  } else if (left.typeval !== right.typeval) {
    console.log('left and right Type mismatch', left.typeval, right.typeval)
    patches.push({
      type: 'PATCH_REPLACE_NODE',
      replacingNode: left,
      node: right
    })
  } else {
    // Now we iterate over all descendants of the left of right side
    // and call ourself recursively
    // console.log("left length",left.children.length)
    // console.log("right length", right.children.length)
    const children = left.children.length >= right.children.length
      ? left.children
      : right.children

    children.forEach((child, index) => diff(
      left.children[index],
      right.children[index],
      patches,
      left
    ))
  }
  console.log('patches are', patches)
}

const ID_KEY = 'data-react-id'
const correlateVDOMNode = (vdomNode, domRoot) => {
  console.log('vdomNode in correlateVDOMNode ', vdomNode)
  console.log('domRoot in correlateVDOMNode ', domRoot)
  if (vdomNode === null) {
    return domRoot
  } else {
    return document.querySelector(`[${ID_KEY}='${vdomNode.id}']`)
  }
}

const createNodeRecursive = (vdomNode, domNode) => {
  if (typeof vdomNode === 'string') {
    console.log('domNode in createNodeRecursive', domNode)
    domNode.innerHTML = vdomNode
  } else {
    const domElement = document.createElement(vdomNode.typeval)
    domElement.setAttribute(ID_KEY, vdomNode.id)
    console.log('domElement in createNodeRecursive', domElement)
    domNode.appendChild(domElement)
    console.log('domNode in createNodeRecursive', domNode)
    vdomNode.children.forEach(child => createNodeRecursive(child, domElement))
  }
}

const applyPatch = (patch, domRoot) => {
  switch (patch.type) {
    case 'PATCH_CREATE_NODE': {
      console.log('in applyPatch-patch create node')
      const domNode = correlateVDOMNode(patch.parent, domRoot)
      console.log('in applyPatch function CREATE NODE', domNode)
      createNodeRecursive(patch.node, domNode)
    }
      break
    case 'PATCH_REMOVE_NODE': {
      console.log('in PATCH_REMOVE_NODE')
      const domNode = correlateVDOMNode(patch.node, domRoot)
      domNode.parentNode.removeChild(domNode)
    }
      break
    case 'PATCH_REPLACE_NODE': {
      const domNode = correlateVDOMNode(patch.replacingNode, domRoot)
      console.log('in PATCH_REPLACE_NODE')
      const parentDomNode = domNode.parentNode
      parentDomNode.removeChild(domNode)
      createNodeRecursive(patch.node, parentDomNode)
    }
      break
    default:
      throw new Error(`Missing implementation for patch ${patch.type}`)
  }
}

const createRender = domElement => {
  console.log('domElement is', domElement)
  let lastVDOM = null
  let patches = null
  return element => {
    const vdom = createVDOM(element)
    console.log('vdom in createRender', vdom)
    patches = []
    diff(lastVDOM, vdom, patches)
    console.log('domElement in return of createRender', domElement)
    patches.forEach(patch => {
      console.log('patch is', patch)
      applyPatch(patch, domElement)
    })
    console.log('')
    lastVDOM = vdom
  }
}

// STEP-4 TESTCASE
const appid = document.getElementById('app')
console.log('appid = ', appid)
const render = createRender(document.getElementById('app'))
console.log('render = ', render)
// console.log('render with arg',render({typeval:'div',props:{},children:[]}))

// let renderComp = [RootComponent1(['some1'])]
// setTimeout(() => { render(renderComp)},2000)
setTimeout(() => { render(h('div', {}, [RootComponent2({user: 'Ramesh'})])) }, 2000)
setTimeout(() => { render(RootComponent1(['Something for you'])) }, 4000)
setTimeout(() => { render(a) }, 6000)
setTimeout(() => { render(b) }, 8000)

// STEP-3 TEST CASE
// const patches = []
// diff(leftVDOM, rightVDOM, patches)

/* element is an object with three properties. Those three properties used within
createVDOM function so give object as input with three properties */
// const vdom = createVDOM({type:'div',props:{},children:[]})
// console.log('vdom = ',vdom)
// Component which can display text in either a div or a span
/*
const RootComponent = ({ showDiv }) => {
  if (showDiv) {
    return h('div', {}, ['Hello World'])
  } else {
    return h('span', {}, ['Hello World'])
  }
}
*/

// We create one tree that uses div
/** **** Input with left is null************/
/*
const leftVDOM = null
const rightVDOM = createVDOM(RootComponent({ showDiv: false }))
console.log("rightVDOM is",rightVDOM)
*/
/** **Input for left != right**************/
/*
const leftVDOM = createVDOM(RootComponent({showDiv: true}))
console.log("leftVDOM is",leftVDOM)
// ...and a second that uses span
const rightVDOM = createVDOM(RootComponent({ showDiv: false }))
console.log("rightVDOM is",rightVDOM)
*/
