const createVDOM = (element, id = '.') => {
  const newElement = {
    typeval: element.typeval,
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

// Component which can display text in either a div or a span
const RootComponent = ({ showDiv }) => {  
  if (showDiv) {
    return h('div', {}, ['Hello World']);
  } else {
    return h('span', {}, ['Hello World']);
  }
}

// We create one tree that uses div
const leftVDOM = null
const rightVDOM = createVDOM(RootComponent({ showDiv: false }));
console.log("rightVDOM is",rightVDOM)
/****Input for left != right**************/
/*
const leftVDOM = createVDOM(RootComponent({showDiv: true}));
console.log("leftVDOM is",leftVDOM)
// ...and a second that uses span
const rightVDOM = createVDOM(RootComponent({ showDiv: false }));
console.log("rightVDOM is",rightVDOM)
*/

const diff = (  
  left,
  right,
  patches,
  parent = null
) => {
  // If the left side (i.e. current vDOM) node does not exist, 
  //we have to create it.
  // In this case we don't have to keep recursing since the creation process
  // itself is recursive
  //console.log("left and right",left.typeval,right.typeval)
  if (!left) {
    console.log("left is null")
    patches.push({
      parent, // We pass in the parent of the left side node
              // so we know whether to attach the newly create descendants
      type: 'PATCH_CREATE_NODE',
      node: right // And of course we pass in the newly created node
    });
  } else if (!right) {
    // If the right side (i.e. the new vDOM) node doesn't exist,
    // we need to remove the node from the vDOM
    patches.push({
      type: 'PATCH_REMOVE_NODE',
      node: left // We just need to pass in the node to remove
    });
  } else if (left.typeval !== right.typeval) {
    // Here the type is changing and so we assume that the subtree
    // has changed and halt the recursion, greatly speeding up
    // the algorithm
    console.log("left and right Type mismatch",left.typeval,right.typeval)
    patches.push({
      type: 'PATCH_REPLACE_NODE',
      replacingNode: left,
      node: right
    })
  }  else {
    // Now we iterate over all descendants of the left of right side
    // and call ourself recursively
    const children = left.children.length >= right.children.length ?
      left.children :
      right.children;

    children.forEach((child, index) => diff(
      left.children[index],
      right.children[index],
      patches,
      left
    ));
  }
  console.log("patches are",patches)
};


const patches = [];  
diff(leftVDOM, rightVDOM, patches);  


/*element is an object with three properties. Those three properties used within
createVDOM function so give object as input with three properties */
const vdom = createVDOM({type:'div',props:{},children:[]})
console.log('vdom = ',vdom)
