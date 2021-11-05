const pubSub = (() =>
{
  const subscribers = {};

  const subscribe = (eventName, callback) =>
  {
    if(subscribers[eventName] === undefined) subscribers[eventName] = [];
    subscribers[eventName].push(callback);
  };

  const publish = (eventName, data) =>
  {
    if(subscribers[eventName] === undefined) return;
    subscribers[eventName].forEach((callback) => { callback(data); });
  };

  return { publish, subscribe };
})();

module.exports = pubSub;
