let classifier;
let resultsDiv;
let clearButton;
let canvas;

function preload() {
  classifier = ml5.imageClassifier('DoodleNet');
}

function setup() {
  canvas = createCanvas(350, 350);
  background(255);
  classifier.classify(canvas, gotResult);
  clearButton = select("#clearBtn");
  clearButton.mousePressed(clearCanvas);
  resultsDiv = select("#results");

  // Prevent page reload on mobile touch events
  canvas.touchStarted(preventDefault);
  canvas.touchMoved(preventDefault);
  canvas.touchEnded(preventDefault);
}

function windowResized() {
  resizeCanvas(350, 350);
  background(255);
}

function clearCanvas() {
  background(255);
}

function draw() {
  strokeWeight(16);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  resultsDiv.html("");
  for (let i = 0; i < min(results.length, 5); i++) {
    const result = results[i];
    const label = result.label;
    const confidence = floor(100 * result.confidence);

    if (i === 0) {
      const article = /^[aeiou]/i.test(label) ? 'an' : 'a';
      resultsDiv.html(`It's ${article} <b>${label} (${confidence}%)</b>, `, true);
    } else {
      const shade = i * 50;
      resultsDiv.html(`<span style="color: rgb(${shade}, ${shade}, ${shade});">${label} (${confidence}%)</span>, `, true);
    }
  }

  const githubLink = createA('https://github.com/J-Zam/sketchNet', 'created by @j-zam');
  githubLink.style('color', 'gray');
  githubLink.position(windowWidth - githubLink.width - 10, windowHeight - githubLink.height - 10);

  canvas.position((windowWidth - width) / 2, ((windowHeight - height) / 2) + 25);
  classifier.classify(canvas, gotResult);
}

// Prevent default behavior for touch events
function preventDefault() {
  return false;
}
