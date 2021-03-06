## 데이터베이스

### 몽고 디비

몽고디비는 <b>비관계형 데이터베이스</b>이다. 이런 시스템을 <b>NoSQL</b> 또는 <b>Not only SQL</b>이라고 한다.  
관계형 데이터베이스는 시스템의 신뢰도를 높이는데 필요한 장치를 많이 가지고 있다. 또, SQL문을 읽어 들이고 실행하는 데 많은 리소스를 사용하며 이 때문에 성능이 떨어지는 경우가 많다. 이에 반해 NoSQL 데이터베이스는 성능을 최우선으로 생각하기 때문에 실시간으로 처리해야 하는 경우나 대용량 트래픽을 감당할 수 있는 메시징 시스템 등에 활용된다. 특히 클라우드 서비스로 서버를 구성하는 경우가 많아지면서 많은 사용자를 수용하거나 시스템 자원을 적게 소모하는 NoSQL 데이터베이스에 점점 더 관심을 갖게 되었다.  

몽고디비는 NoSQL이기 떄문에 관계형 데이터베이스의 테이블 개념이 없다. 그 대신 몽고디비는 여러 데이터가 모인 하나의 단위를 <b>컬랙션(Collection)</b>이라고 부른다. 관계형 데이터베이스의 테이블이 컬랙션이라고 생각할 수도 있지만 테이블과 달리, 데이터를 정해놓은 칼럼의 형태대로 컬렉션에 넣어야 한다는 제약이 없다.

몽고디비는 데이터 저장소를 가지고 있으며 그 안에 여러 개의 컬렉션을 넣을 수 있다. 즉, 데이터베이스는 **컬랙션의 집합** 이라고 할 수 있다. 그리고 각각의 컬랙션은 여러 개의 **문서 객체(Document)** 를 가질 수 있다. 문서 객체는 속성들의 집합으로서 한 사람의 이름과 나이 등을 저장하고 싶을 떄 하나의 문서 객체를 만든 후 그 안에 자바스크립트 객체와 같이 속성들을 추가하여 저장할 수 있다.

### 몽구스(mongoose)
몽고디비를 사용하면서 하나의 컬랙션 안에 똑같은 속성을 가진 문서 객체를 반복적으로 넣어 둔다면 데이터를 조회할 때도 어떤 속성들이 들어 있는지 미리 알 소 있는 상태에서 조회할 수 있다. 따라서 관계형 데이터베이스의 테이블이나 엑셀의 시트(sheet)처럼 쉽게 다룰 수 있다. 이와 같이 일정한 틀을 제공하는 모듈 중에서 대표적인 것이 **몽구스(mongoose)** 이다.  

NoSQL 데이터베이스 중 하나인 몽고디비를 사용하면 문서 객체 안에 들어가는 속성을 마음대로 바꿀 수 있으므로 매우 유연하게 데이터를 저장할 수 있다. 하지만 컬랙션 안에 들어 있는 여러 개의 문서 객체를 조회할 때는 제약이 생길 수도 있다. 예를 들어, 같은 users 컬랙션 안에 들어 있는 문서 객체라도 어떤 문서 객체에는 name 속성이 있는 데 반해 다른 문서 객체에는 name 속성이 없을 수도 있다. 그래서 관계형 데이터베이스처럼 조회 조건을 공통 적용하기 어려운 문제점이 있다. 이런 문제 때문에 **스키마(Schema)** 를 만들고, 그 스키마에 따라 문서 객체를 저장하는 것이 때로는 편리하다. 특히 일정한 틀에 맞는 자바스크립트 객체를 그대로 데이터 베이스에 저장하거나 일정한 틀에 맞게 구축된 데이터베이스의 문서 객체를 자바스크립트 객체로 바꿀 수 있다면 훨씬 편하게 데이터베이스를 다룰 수 있다.

> #### 스키마(Schema)란?
> 스키마란 데이터베이스의 구조를 정의한 것을 말한다. 예를 들어 엑셀 시트에 이름과 나이 데이터를 넣으려고 한다면 첫 번째 칼럼에는 이름은 문자로 넣고, 두 번째 칼럼에는 나이를 숫자로 넣는다는 것을 미리 정해 둘 수 있다.
>  