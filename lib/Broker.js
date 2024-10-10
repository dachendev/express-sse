class Broker {
  constructor() {
    this.subs = new Map()
  }

  subscribe(topic, cb) {
    if (!this.subs.has(topic)) {
      this.subs.set(topic, new Map())
    }
    const id = Symbol()
    this.subs.get(topic).set(id, cb)
    return id
  }

  unsubscribe(topic, id) {
    const topicSubs = this.subs.get(topic)
    if (topicSubs) {
      topicSubs.delete(id)
      if (topicSubs.size === 0) {
        this.subs.delete(topic)
      }
    }
  }

  unsubscribeAll() {
    this.subs.forEach((topicSubs, topic) => {
      topicSubs.forEach((_, id) => this.unsubscribe(topic, id))
    })
  }

  publish(topic, data) {
    const topicSubs = this.subs.get(topic)
    if (topicSubs && topicSubs.size > 0) {
      topicSubs.forEach((cb) => cb(data))
    }
  }
}

module.exports = Broker
