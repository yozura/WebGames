var gl; // WebGL 컨텍스트를 받기 위한 전역 변수

function start() {
    var canvas = document.getElementById("glcanvas");
    gl = initWebGL(canvas); // GL 컨텍스트 초기화

    // gl 컨텍스트가 사용 가능해야만 밑의 구절이 실행됨
    if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // 백그라운드 컬러 설정 (RGBA)
        gl.enable(gl.DEPTH_TEST);           // 깊이 테스트? 기능 켜기
        gl.depthFunc(gl.LEQUAL);            // 가까운 오브젝트가 멀리 있는 오브젝트를 가리도록 함.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 깊이 버퍼와 색상 버퍼를 동시에 표현             
        initShaders();
        drawScene();
    }
}

function initWebGL(canvas) {
    gl = null;
    
    try {
        // 표준 컨텍스트를 찾음, 만약 표준 컨텍스트를 못찾으면
        // experimental-webgl 컨텍스트를 받아옴.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}

    // 만약 gl 컨텍스트를 갖지 못하면 null값으로 되돌려보냄
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    }

    return gl;
}

// 이미 만들어진 Shader 를 불러옴.
function initShaders() {
    const vsSource = `
        attribute vec3 aVertexPosition;
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        void main(void) {
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        }`;
    
    const fsSource = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }`;
    
    // 조각 쉐이더
    var fragmentShader = getShader(gl, "shader-fs");
    // 정점 쉐이더
    var vertexShader = getShader(gl, "shader-vs");

    // Shader 프로그램 생성
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Shader 프로그램 생성 실패시 alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(shaderProgram);

    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
}

function getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;
    shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    // MIME Type
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        // Unknown Shader Type
        return null;
    }

    gl.shaderSource(shader, theSource);
    
    // Shader Program 컴파일하기
    gl.compileShader(shader);

    // 컴파일에 성공하면...
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shader: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var horizAspect = 480.0 / 640.0;

function initBuffers() {
    squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    var vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 카메라의 시점을 45도, 종횡비를 640 / 480 (캔버스의 크기), near 0.1, Far 100 사이의 오브젝트만 렌더링.
    perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

    // 항등 위치를 불러오고, 카메라에서 6단위 만큼 변환한 후 위치 조정
    loadIdentity();
    mvTranslate([-0.0, 0.0, -6.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function loadIdentity() {
    mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]]).ensure4x4()));
}

function setMatrixUniforms() {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false , new Float32Array(perspectiveMatrix.flatten()));

    var mvUniform =  gl.getUniformLocation(shaderProgram, 'uMVMatrix');
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}
