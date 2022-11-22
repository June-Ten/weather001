const STEP_SIZE = 6;
const STEP_NUM = 24;
const STEP_OFFSET = 1;
const TARGET_SIZE = 24;
const LSTM_UNITS = 30;

const X_LEN = STEP_SIZE + STEP_OFFSET * (STEP_NUM - 1);
const Y_LEN = TARGET_SIZE;

const config = {
	epochs: 30,
	batchSize: 4
};

async function loadData(path) {
	return await d3.csv(path);
}

// function drawChart(data) {
//   $('#dataView').empty();
//   var chart = new G2.Chart({
//     container: "dataView",
//     forceFit: true,
//     height: 300 });

//   chart.source(data);
//   chart.scale("value", {
//     min: 0,
//     max: 800 });

//   chart.scale("predictValue", {
//     min: 0,
//     max: 800 });

//   chart.scale("time", {
//     tickCount: 10,
//     type: "time" });

//   chart.line().position("time*value").color("isPrediction");
//   chart.render();
// }

function buildX(data, stepSize, stepNum, stepOffset) {
	let xData = [];
	for (let n = 0; n < stepNum; n += 1) {
		const startIndex = n * stepOffset;
		const endIndex = startIndex + stepSize;
		const item = data.slice(startIndex, endIndex).map(obj => obj.value);
		xData.push(item);
	}
	return xData;
}

function makeTrainData(data, stepSize, stepNum, stepOffset, targetSize) {
	const trainData = {
		x: [],
		y: []
	};

	const length = data.length;

	const xLength = stepSize + stepOffset * (stepNum - 1);
	const yLength = targetSize;
	const stopIndex = length - xLength - yLength;

	for (let i = 0; i < stopIndex; i += 1) {
		const x = data.slice(i, i + xLength);
		const y = data.slice(i + xLength + 1, i + xLength + 1 + yLength);

		const xData = buildX(x, stepSize, stepNum, stepOffset);
		const yData = y;

		trainData.x.push(xData.map(item => item));
		trainData.y.push(yData.map(item => item.value));
	}
	return trainData;
}

function buildModel() {
	const model = tf.sequential();

	//lstm input layer
	const hidden1 = tf.layers.lstm({
		units: LSTM_UNITS,
		inputShape: [STEP_NUM, STEP_SIZE],
		returnSequences: true
	});

	model.add(hidden1);


	//2nd lstm layer
	const output = tf.layers.lstm({
		units: TARGET_SIZE,
		returnSequences: false
	});

	model.add(output);

	model.add(
		tf.layers.dense({
			units: TARGET_SIZE
		}));



	model.add(tf.layers.activation({
		activation: "tanh"
	}));

	//compile
	const rmsprop = tf.train.rmsprop(0.005);
	model.compile({
		optimizer: rmsprop,
		loss: tf.losses.meanSquaredError
	});


	return model;
}

async function predict(model, input) {
	const prediction = await model.predict(tf.tensor([input])).data();
	return prediction;
}

async function watchTraining() {
	const metrics = ["loss", "val_loss", "acc", "val_acc"];
	const container = {
		name: "show.fitCallbacks",
		tab: "Training",
		styles: {
			height: "1000px"
		}
	};


	const callbacks = tfvis.show.fitCallbacks(container, metrics);
	return train(model, data, callbacks);
}

async function trainBatch(data, model) {
	const metrics = ["loss", "val_loss", "acc", "val_acc"];
	const container = {
		name: "show.fitCallbacks",
		tab: "Training",
		drawArea: document.getElementById('tensorflow-container')
		// styles: {
		//   height: "1000px" } };
	}

	const callbacks = tfvis.show.fitCallbacks(container, metrics);

	console.log("training start!");
	// tfvis.visor();
	// Save the model
	// const saveResults = await model.save('downloads://air-time-model');
	const epochs = config.epochs;
	const results = [];
	const xs = tf.tensor3d(data.x);
	const ys = tf.tensor2d(data.y);

	const history = await model.fit(xs, ys, {
		batchSize: config.batchSize,
		epochs: config.epochs,
		validationSplit: 0.2,
		callbacks: callbacks
	});


	console.log("training complete!");
	return history;
}

(async function() {
	const airPassagnerData = await loadData(
		"https://cdn.jsdelivr.net/gh/gangtao/datasets@master/csv/air_passengers.csv");

	console.log('获取的原始数据', airPassagnerData)
	// const chartData = airPassagnerData.map(item => ({
	//   time: item.Date,
	//   value: parseInt(item.Number) }));


	// drawChart(chartData);

	// Normalize data with value change
	let changeData = [];
	for (let i = 1; i < airPassagnerData.length; i++) {
		const item = {};
		item.date = airPassagnerData[i].Date;
		const val = parseInt(airPassagnerData[i].Number);
		const val0 = parseInt(airPassagnerData[i - 1].Number);
		item.value = val / val0 - 1;
		changeData.push(item);
	}
	console.log('标准化数据', changeData)

	const trainData = makeTrainData(
		changeData,
		STEP_SIZE,
		STEP_NUM,
		STEP_OFFSET,
		TARGET_SIZE);

	const model = buildModel();
	model.summary();

	const history = await trainBatch(trainData, model);

	const inputStart = changeData.length - X_LEN;
	const inputEnd = changeData.length;
	const input = changeData.slice(inputStart, inputEnd);
	const predictInput = buildX(input, STEP_SIZE, STEP_NUM, STEP_OFFSET);
	const prediction = await predict(model, predictInput);

	// re-constructe predicted value based on change
	const base = airPassagnerData[airPassagnerData.length - 1];
	const baseDate = moment(new Date(base.Date));
	const baseValue = parseInt(base.Number);

	let predictionValue = [];
	let val = baseValue;
	for (let i = 0; i < prediction.length; i += 1) {
		const item = {};
		const date = baseDate.add(1, 'months');
		item.time = moment(date).format('YYYY-MM-DD');
		item.value = val + val * prediction[i];
		item.isPrediction = "Yes";
		predictionValue.push(item);
		val = item.value;
	}

	console.log(predictionValue);
	let airPassagnerDataWithPrediction = [];
	// chartData.forEach(item => {
	//   item.isPrediction = "No";
	//   airPassagnerDataWithPrediction.push(item);
	// });
	predictionValue.forEach(item => {
		airPassagnerDataWithPrediction.push(item);
	});
	// drawChart(airPassagnerDataWithPrediction);

})()
