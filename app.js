class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(sortedArray);
  }

  buildTree(array) {
    if (array.length === 0) return null;

    const mid = Math.floor(array.length / 2);
    const node = new Node(array[mid]);

    node.left = this.buildTree(array.slice(0, mid));
    node.right = this.buildTree(array.slice(mid + 1));

    return node;
  }

  insert(value, node = this.root) {
    if (node === null) return new Node(value);

    if (value < node.data) {
      node.left = this.insert(value, node.left);
    } else if (value > node.data) {
      node.right = this.insert(value, node.right);
    }

    return node;
  }

  deleteItem(value, node = this.root) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.deleteItem(value, node.left);
    } else if (value > node.data) {
      node.right = this.deleteItem(value, node.right);
    } else {
      if (node.left === null && node.right === null) {
        return null;
      }

      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      let successor = this.findMin(node.right);
      node.data = successor.data;

      node.right = this.deleteItem(successor.data, node.right);
    }

    return node;
  }

  findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  find(value, node = this.root) {
    if (node === 0) return null;

    if (value === node.data) return node;
    if (value < node.data) return this.find(value, node.left);
    if (value > node.data) return this.find(value, node.right);
  }

  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }

    const queue = [];
    if (this.root) queue.push(this.root);

    while (queue.length > 0) {
      const current = queue.shift();
      callback(current);

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }
  levelOrderRecursive(callback, queue = [this.root]) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }

    if (queue.length === 0) return;

    const current = queue.shift();
    if (current) {
      callback(current);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
      this.levelOrderRecursive(callback, queue);
    }
  }
  inOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }
    if (node === null) return;

    this.inOrderForEach(callback, node.left);
    callback(node);
    this.inOrderForEach(callback, node.right);
  }

  preOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }
    if (node === null) return;

    callback(node);
    this.preOrderForEach(callback, node.left);
    this.preOrderForEach(callback, node.right);
  }

  postOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }
    if (node === null) return;

    this.postOrderForEach(callback, node.left);
    this.postOrderForEach(callback, node.right);
    callback(node);
  }

  height(value, node = this.root) {
    const target = this.find(value, node);
    if (!target) return null;

    function getHeight(node) {
      if (node === null) return -1;
      const leftHeight = getHeight(node.left);
      const rightHeight = getHeight(node.right);
      return Math.max(leftHeight, rightHeight) + 1;
    }

    return getHeight(target);
  }

  depth(value, node = this.root, currentDepth = 0) {
    if (node === null) return null;

    if (value === node.data) return currentDepth;

    if (value < node.data) {
      return this.depth(value, node.left, currentDepth + 1);
    } else if (value > node.data) {
      return this.depth(value, node.right, currentDepth + 1);
    }

    return null;
  }

  isBalanced(node = this.root) {
    function checkBalance(node) {
      if (node === null) return 0;

      const leftHeight = checkBalance(node.left);
      if (leftHeight === -1) return -1;

      const rightHeight = checkBalance(node.right);
      if (rightHeight === -1) return -1;

      if (Math.abs(leftHeight - rightHeight) > 1) return -1;

      return Math.max(leftHeight, rightHeight) + 1;
    }

    return checkBalance(node) !== -1;
  }

  rebalance() {
    const values = [];
    this.inOrderForEach((node) => values.push(node.data));

    this.root = this.buildTree(values);
  }
}

function generateRandomArray(size = 15, max = 100) {
  const arr = [];
  while (arr.length < size) {
    arr.push(Math.floor(Math.random() * max));
  }
  return arr;
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) return;
  if (node.right !== null)
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null)
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};

const randomArray = generateRandomArray();
console.log("Random Array:", randomArray);

const tree = new Tree(randomArray);

console.log("\nInitial tree:");
prettyPrint(tree.root);

console.log("\nIs tree balanced?", tree.isBalanced());

console.log("\nLevel-order traversal:");
tree.levelOrderForEach((node) => console.log(node.data));

console.log("\nPre-order traversal:");
tree.preOrderForEach((node) => console.log(node.data));

console.log("\nPost-order traversal:");
tree.postOrderForEach((node) => console.log(node.data));

console.log("\nIn-order traversal:");
tree.inOrderForEach((node) => console.log(node.data));

[101, 150, 200, 250, 300].forEach((num) => tree.insert(num));

console.log("\nTree after unbalancing (added numbers > 100):");
prettyPrint(tree.root);

console.log("\nIs tree balanced after skewing?", tree.isBalanced());

tree.rebalance();

console.log("\nTree after rebalancing:");
prettyPrint(tree.root);

console.log("\nIs tree balanced after rebalance?", tree.isBalanced());

console.log("\nLevel-order traversal after rebalance:");
tree.levelOrderForEach((node) => console.log(node.data));

console.log("\nPre-order traversal after rebalance:");
tree.preOrderForEach((node) => console.log(node.data));

console.log("\nPost-order traversal after rebalance:");
tree.postOrderForEach((node) => console.log(node.data));

console.log("\nIn-order traversal after rebalance:");
tree.inOrderForEach((node) => console.log(node.data));
