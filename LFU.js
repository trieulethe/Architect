/**
 *  Caching architect
 *  Implement Least Frequently Used
 */

// init struct of LFU node
function LFUNode(key, value) {
    this.prev = null
    this.next = null
    this.key = key
    this.data = value
    this.freqCount = 1
}

// link list LFU
function LFUDoublyLinkedList() {
    this.head = new LFUNode('buffer head', null)
    this.tail = new LFUNode('buffer tail', null)
    this.head.next = this.tail
    this.tail.prev = this.head
    this.size = 0
}

// cache
function LFUCache(capacity) {
    // stores LFUNode
    this.keys = {}
    // stores LFUDoublyLinkedList
    this.freq = {}
    this.capacity = capacity
    this.minFreq = 0
    this.size = 0
}

LFUDoublyLinkedList.prototype.insertAtHead = function (node) {
    node.next = this.head.next
    this.head.next.prev = node
    this.head.next = node
    node.prev = this.head
    this.size++
}

LFUDoublyLinkedList.prototype.removeAtTail = function () {
    var oldTail = this.tail.prev
    var prev = this.tail.prev
    prev.prev.next = this.tail
    this.tail.prev = prev.prev
    this.size--
    return oldTail
}

LFUDoublyLinkedList.prototype.removeNode = function (node) {
    node.prev.next = node.next
    node.next.prev = node.prev
    this.size--
}

LFUCache.prototype.set = function (key, value) {
    var node = this.keys[key]

    if (node == undefined) {
        node = new LFUNode(key, value)

        this.keys[key] = node

        if (this.size != this.capacity) {
            // insert without deleting
            if (this.freq[1] === undefined) {
                this.freq[1] = new LFUDoublyLinkedList()
            }
            this.freq[1].insertAtHead(node)
            this.size++
        } else {
            // delete and insert
            var oldTail = this.freq[this.minFreq].removeAtTail()
            delete this.keys[oldTail.key]

            if (this.freq[1] === undefined) {
                this.freqp[1] = new LFUDoublyLinkedList()
            }

            this.freq[1].insertAtHead(node)
        }
        this.minFreq = 1
    } else {
        var oldFreqCount = node.freqCount
        node.data = value
        node.freqCount++

        this.freq[oldFreqCount].removeNode(node)

        if (this.freq[node.freqCount] === undefined) {
            this.freq[node.freqCount] = new LFUDoublyLinkedList()
        }

        this.freq[node.freqCount].insertAtHead(node)

        if (oldFreqCount == this.minFreq && Object.keys(this.freq[oldFreqCount]).size == 0) {
            this.minFreq++
        }
    }
}

LFUCache.prototype.get = function (key) {
    var node = this.keys[key];

    if (node == undefined) {
        return null;

    } else {
        var oldFreqCount = node.freqCount;
        node.freqCount++;

        this.freq[oldFreqCount].removeNode(node);

        if (this.freq[node.freqCount] === undefined) {
            this.freq[node.freqCount] = new LFUDoublyLinkedList();

        }

        this.freq[node.freqCount].insertAtHead(node);

        if (oldFreqCount == this.minFreq && Object.keys(this.
            freq[oldFreqCount]).length == 0) {
            this.minFreq++;

        }
        return node.data;
    }
}

var myLFU = new LFUCache(5);
myLFU.set(1, 1); // state of myLFU.freq: {1: 1}
myLFU.set(2, 2); // state of myLFU.freq: {1: 2<->1}
myLFU.set(3, 3); // state of myLFU.freq: {1: 3<->2<->1}
myLFU.set(4, 4); // state of myLFU.freq: {1: 4<->3<->2<->1}
myLFU.set(5, 5); // state of myLFU.freq: {1: 5<->4<->3<->2<->1}
myLFU.get(1); // returns 1, state of myLFU.freq: {1: 5<->4<->3<->2, 2: 1}
myLFU.get(1); // returns 1, state of myLFU.freq: {1: 5<->4<->3<->2, 3: 1}
myLFU.get(1); // returns 1, state of myLFU.freq: {1: 5<->4<->3<->2, 4: 1}
myLFU.set(6, 6); // state of myLFU.freq: {1: 6<->5<->4<->3, 4: 1}
myLFU.get(6); // state of myLFU.freq: {1: 5<->4<->3, 4: 1, 2: 6}
