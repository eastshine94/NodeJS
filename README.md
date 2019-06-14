# NodeJS

# Do it! Node.js 프로그래밍
[![book](http://www.easyspub.co.kr/upload/BOOK/127/20170224173013094710B.jpg)](http://www.easyspub.co.kr/20_Menu/BookView/A001/127/PUB)


## 01-1 노드란 무엇일까?

### 1. 비동기 입출력(Non-Blocking IO)
 웹 서버의 파일 업로드 핸들러가 하나의 요청이 끝날 때까지 다른 요청을 대기시켜 응답 시간이 길어지거나, 서버에서 처리해야 하는 요청의 수가 증가하면 CPU나 메모리 사용량도 크게 증가하는 문제가 발생했다.  
 
이런 문제를 해결하기 위해 만든 게 노드이다. 즉, 하나의 요청 처리가 끝날 때까지 기다리지 않고 다른 요청을 동시에 처리할 수 있는 <strong>비동기 입출력(Non-Blocking IO)</strong> 방식을 적용했다.  

<strong>동기 입출력(Blocking IO)</strong>의 경우, PC에 있는 파일의 내용을 읽어올 때, 먼저 시스템에 읽기 요청을 한다. 이때 파일 시스템에서는 디스크에 있는 파일을 확인하고 준비한 다음 처리하는 시간이 필요한데 그동안 프로그램은 다른 작업을 진행하지 않고 대기하게 된다. 프로그램이 파일의 내용을 읽어와 그 내용을 화면에 보여 준 다음에야 다른 작업을 진행할 수 있다. 결국 프로그램을 실행하는 중간중간 대기 시간이 발생하면서 속도가 느려지는 문제가 생기게 된다. 그런데 이것을 <strong>비동기 방식</strong>으로 바꾸면 파일을 읽어 들일 떄 대기하는 시간이 없어지게 된다.  

### 2. 콜백 함수(Callback Function)
비동기 방식이 프로그램에서 다른 작업을 진행하는 중간에 파일 시스템에서 파일 처리를 할 수 있는 이유는 <strong>콜백 함수(Callback Function)</strong> 덕분이다. 프로그램에서는 파일 읽기 요청을 하기 전에 콜백 함수를 등록하는데, 파일 시스템은 파일 처리가 끝나면 자동으로 콜백 함수를 호출하게 된다. 따라서 프로그램이 파일 읽기 작업이 끝날 때까지 대기하지 않아도 파일을 다 읽은 시점에 통보를 받고 파일의 내용을 화면에 보여주는 작업을 진행할 수 있다.

>자바스크립트에서는 변수에 함수를 할당할 수 있다. 따라서 변수에 할당된 함수를 다른 함수의 파라미터로 전달할 수 있다. 이렇게 파라미터로 전달된 함수를 다른 함수의 내부에서 호출하는 것이 <b>콜백 함수</b>이다.  

### 3. 이벤트 기반 입출력(Event driven I/O)
파일 읽기가 완료되었을 때 파일 시스템에서 콜백함수를 호출하는데, 파일 시스템이 이벤트와 함께 호출하는 방식이면 <b>이벤트 기반 입출력(Event driven I/O)</b> 모델이라고 부른다.  
파일 시스템에서 파일 읽기가 완료되었다는 이벤트만 전달하면 프로그램에서는 그 이벤트를 받아 콜백 함수를 실행할 수 있으며, 콜백 함수는 이벤트가 발생하기 전에 미리 등록한다.  

자바스크립트에서는 on() 메소드를 사용해 이벤트를 콜백 함수와 <b>바인딩(Binding)</b> 할 수 있다. 응답 객체인 res 객체의 on() 메소드를 사용해 data 이벤트와 콜백 함수를 바인딩하면 data라는 이름의 이벤트를 받았을 때 등록한 콜백 함수가 실행된다.
> 이벤트를 바인딩한다는 것이 어떤 의미인가?  
---
> 바인딩(Binding)이란 서로 묶어서 연결해 준다는 의미이다. 예를 들어, 버튼이 하나 있는데 이 버튼을 클릭 했을 때 click 이벤트가 발생한다고 가정한다. 이 때 click 이벤트를 함수 객체와 바인딩하면 이 click 이벤트가 발생했을 때 등록한 함수 객체가 실핸된다. 즉 사용자가 버튼을 클릭하면 이 함수가 실행된다. 그 형식을 다음과 같다.
>> res.on('data', function(){...});

### 4. 모듈과 패키지
소스 파일 하나에 실행하려는 기능이 모두 들어 있다면 코드의 양이 많을 뿐만 아니라 복잡해진다. 따라서 필요한 기능을 별도의 자바스크립트 파일로 만든 후 필요할 때마다 불러와 사용한다. 이처럼 메인이 되는 자바스크립트 파일의 일부 코드를 떼어 별도의 파일로 만들어진 것을 <b>모듈(Module)</b>이라 한다.

여러 프로그램에서 공통으로 사용하는 기능은 모듈로 분리하여 구성하는 것이 일반적이다. Node는 개발에 필요한 여러 개의 모듈을 합쳐서 하나의 <b>패키지(Package)</b>로 만들어 다른 프로그래머들이 npm 프로그램으로 손쉽게 패키지를 설치하여 사용할 수 있도록 하였다.

### 5. 요약
 노드는 기본적으로 자바스크립트를 프로그래밍 언어로 사용하며 다음과 같은 세 가지 주요 특징이 있다.  
 
 ![노드의 주요 특징](http://dataguru.kr/wp-content/uploads/2017/10/%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%E1%84%8B%E1%85%B4-%E1%84%8C%E1%85%AE%E1%84%8B%E1%85%AD-%E1%84%90%E1%85%B3%E1%86%A8%E1%84%8C%E1%85%B5%E1%86%BC.png)

### 참고 자료  
정재곤, Do it! Node.js 프로그래밍 실제 서버로 구동 가능한 코드로 배운다!, 개정 4판, 이지스퍼블리싱, 2017