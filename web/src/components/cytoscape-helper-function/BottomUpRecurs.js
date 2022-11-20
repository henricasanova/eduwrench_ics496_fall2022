import CytoscapeHashTable from './CytoscapeHashTable';

export const BotttomUpRecurs = ({ temp, jsonData }) => {
  console.log(temp, jsonData)
  const jsonObj = Object.fromEntries(jsonData.map((jArr, index) => [jArr.name, index]))

  function bottomUp(node) {
    const { name, parents } = node
    const index = jsonObj[name]
    let newNodeToCheck

    if (jsonData[index].topLevel > 0) {
      return jsonData[index].topLevel
    }

    if (parents.length <= 0) {
      node.topLevel = 0
      return node.topLevel
    } else {
      for (let nodeElement of parents) {
        const newIndex = jsonObj[nodeElement]
        newNodeToCheck = jsonData[newIndex]
        if (!newNodeToCheck.children) newNodeToCheck.children = []
        if (!newNodeToCheck.children.find(child => child === name)) newNodeToCheck.children.push(name)
        jsonData[index].topLevel = 1 + bottomUp(newNodeToCheck)
      }
    }
    jsonData[index].topLevel = 1 + newNodeToCheck.topLevel
  }
  bottomUp(temp[0])
  return jsonData
}
