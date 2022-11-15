function divideByTopLevel(arr, length) {
  const arrState = []
  for (let i = 0; i <= length; i++) {
    arrState.push(arr.filter(f => f.topLevel === i))
  }
  return arrState
}

function swap(A, num1, num2) {
  let temp2 = A[num1]
  A[num1] = A[num2]
  A[num2] = temp2
}

function partitionJson(array, start, end) {
  let value = array[end]
  let index = start
  for (let j = start; j < end; j++) {
    if (array[j].topLevel < value.topLevel) {
      swap(array, j, index)
      index++
    }
  }
  swap(array, index, end)
  return index
}

function sortJson(array, start, end) {
  if (start >= end) {
    return
  }
  let q = partitionJson(array, start, end)
  sortJson(array, start, q - 1)
  sortJson(array, q + 1, end)
  return array
}

function compute(data) {
  let length = data.length
  for (let i = 0; i <= length - 1; i++) {
    data[i].x = (i + 1) * (3000 / (length + 1))
    data[i].y = data[i].topLevel * 250
  }
}


function computeBasedOnParents(data, list) {
  const getParentsXCorr = (nodeName) => {
    const { x } = list.filter(l => l.name === nodeName)[0]
    return x
  }
  let length = data.length
  for (let i = 0; i <= length - 1; i++) {
    if (data[i].x) {
      return
    }
    let newCorr = 0
    const { parents } = data[i]
    for (let element of parents) {
      newCorr += getParentsXCorr(element)
    }
    data[i].x = newCorr / parents.length
  }
  data.sort(function (a, b) {
    return a.x < b.x
  })
  compute(data)
}

export const SortNodeArray = ({ getTopLevel }) => {
  console.log(getTopLevel)
  const sortedArray = sortJson(getTopLevel, 0, getTopLevel.length - 1)
  const resultLength = sortedArray[getTopLevel.length - 1].topLevel
  const sortedTopLevel = divideByTopLevel(sortedArray, resultLength)
  compute(sortedTopLevel[0])
  sortedTopLevel.map(arr => computeBasedOnParents(arr, sortedArray))
  return { sortedTopLevel, resultLength }
}
