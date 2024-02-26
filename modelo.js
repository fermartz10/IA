const tf = require('@tensorflow/tfjs');

function crearModelo(datos) {
  const xs = datos.map(entry => [entry.dia, entry.hora]);
  const ys = datos.map(entry => entry.valor_medido);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [2] }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
  
  const xsTensor = tf.tensor2d(xs);
  const ysTensor = tf.tensor1d(ys);

  return model.fit(xsTensor, ysTensor, { epochs: 100 });
}

module.exports = crearModelo;
