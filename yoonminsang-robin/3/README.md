# 코드에서 나는 악취

- ()는 내 생각

## 기이한 이름

- 코드를 명료하게 표현하는데 표현하는데 가장 중요한 요소 하나는 바로 `이름`이다.
- 마땅한 이름이 떠오르지 않는다면 설게에 더 근본적인 문제가 숨어 있을 가능성이 높다.
- (너무 많은 역할을 하고 있지는 않은지 생각해보자)

## 중복 코드

- 한 클래스에 딸린 두 메서드가 같은 표현식을 사용하면 `함수 추출하기`로 합치자.
- 비슷하다면 `문장 슬라이드하기`로 비슷한 부분을 한 곳에 모아 함수 추출하기를 더 쉽게 적용할 수 있는지 살펴보자.
- 한 부모로부터 나온 서브 클래스에 코드가 중복되어 있다면 `메서드 올리기` 적용.

## 긴 함수

- 오랜 기간 잘 활용되는 프로그램은 하나같이 짧은 함수로 구성됐다.
- 여러 함수를 왔다 갔다 해야 하므로 부담이 된다. 개발환경이 좋아져서 부담이 조금은 줄어들었지만 근본적으로는 좋은 이름을 지어야한다.
- 함수 이름을 잘 지어두면 본문 코드를 볼 이유가 사라진다.(선언형 프로그래밍)
- 주석으로 달만한 부분은 무조건 함수로 만들자. 함수이름으로 동작방식이 아닌 `의도`가 들어나게 짓는다.
- 핵심은 함수의 길이가 아닌, 함수의 목적(의도)과 구현 코드의 괴리가 얼마나 큰가다. 즉 `무엇을 하는지`를 코드가 잘 설명해주지 못할수록 함수로 만드는 게 유리하다.
- 함수를 짧게 만드는 작업의 90%는 `함수 추출하기`이다.
- 함수가 매개변와 임시 변수를 많이 사용한다면 추출 작업에 방해가 된다. 이럴땐 `임시 변수를 질의 함수로 바꾸기`로 임시 변수의 수를, `매개변수 객체 만들기`와 `객체 통째로 넘기기`로는 매개변수의 수를 줄일 수 있다.
- 이래도 임시 변수와 매개 변수가 너무 많다면 `함수를 명령으로 바꾸기`를 고려해보자.(이거는 나중에 공부)
- 추출할 코드 덩어리는 주석을 기반으로 찾자. 코드가 단 한줄이어도 따로 설명할 필요가 있다면 함수로 추출하는 게 좋다.
- 조건문은 `조건문 분해하기`
- 거대한 switch문을 구성하는 case문마다 `함수 추출하기`
- 같은 조건을 기준으로 나뉘는 switch문이 여러 개라면 `조건부 로직을 다형성으로 바꾸기`
- 반복문도 그 안의 코드와 함께 추출해서 독립된 함수로 만든다. 추출한 반복문 코드에 적합한 이름이 떠오르지 않는다면 과감하게 `반복문 쪼개기`를 적용해서 작업을 분리.

## 긴 매개변수 목록

- 매개변수를 질의 함수로 바꾸기, 객체 통째로 넘기기, 매개변수 객체 만들기, 플래그 인수 제거하기(매개변수를 메서드로 전환), 여러 함수를 클래스로 묶기

## 전역 데이터

- 전역 데이터의 대표적인 형태는 전역 변수지만 클래스 변수와 싱글톤에서도 같은 문제가 발생한다.
- 이를 방지하기 위해 `변수 캡슐화하기`를 사용할 수 있다.

## 가변 데이터

- 함수형 프로그래밍을 적용할수도 있지만 현실적으로 쉽지 않다.
- 변수 캠슐화하기.
- 하나의 변수에 용도가 다른 값들을 저장하느라 값을 갱신하는 경우라면 `변수 쪼개기`
- `문장 슬라이드하기`, `함수 추출하기`를 이용해서 무언가를 갱신하는 코드로부터 부작용이 없는 코드를 분리한다.
- 가능한 `세터 제거하기`
- `파생 변수를 질의 함수로 바꾸기`
- `여러 함수를 클래스로 묶기`, `여러 함수를 변환 함수로 묶기`
- 구조체처럼 내부 필드에 데이터를 담고 있는 변수라면, 일반적으로 `참조를 값으로 바꾸기`를 적용하여, 내부 필드를 직접 수정하지 말고 구조체를 통째로 교체하기(리덕스에 통째로 바꾸기??)

## 뒤엉킨 변경

- 뒤엉킨 변경은 단일 책임 원칙(Single Responsibility Principle SRP)이 제대로 지켜지지 않을 때 나타난다.
- 순차적으로 실행되는 게 자연스러운 맥락이라면, 특정한 데이터 구조에 담아서 전달하게 하는 식으로 단계를 분리한다. `단계 쪼개기`
- 전체 처리 과정 곳곳에서 각기 다른 맥락의 함수를 호출하는 빈도가 놏다면, 각 맥락에 해당하는 적당한 `모듈`들을 만들어서 관련 함수들을 모은다. `함수 옮기기`
- 여러 맥락에 관여하는 함수가 있다면 옮기기 전에 `함수 추출하기`부터 수행. 모듈이 클래스라면 `클래스 추출하기`

## 산탄총 수술

- 뒤엉킨 변경과 비슷하면서도 정반대다. 뒤엉킨 변경은 한 코드에 섞여 들어간 코드를 맥락별로 분리해야하고 산탄총 수술은 여러 코드에 흩뿌려진 코드를 맥락별로 모아야한다.
- 함께 변경되는 대상들을 `함수 옮기기`와 `필드 옮기기`로 모두 한 모듈에 묶어두자.
- `여러 함수를 클래스로 묶기`, `여러 함수를 변환 함수로 묶기` 적용.
- 이렇게 묶은 함수들의 출력 결과를 묶어서 다음 단계의 로직으로 전달할 수 있다면 `단계 쪼개기` 적용
- `함수 인라인`, `클래스 인라인하기` 적용. 코드를 재구성하는 중간 과정에서는 큰 덩어리로 뭉쳐지는데 개의치 않는다.

## 기능 편애

- 프로그램을 모듈화할 때는 코드를 여러 영역으로 나눈 뒤 영역 안에서 이뤄지는 상호작용은 최대한 늘리고 영역 사이에서 이뤄지는 상호작용은 최소로 줄이는데 주력한다.
- 기능 편애는 흔히 어떤 함수가 자기가 속한 모듈의 함수나 데이터보다 다른 모듈의 함수나 데이터와 상호작용 할 일이 더 많을 때 풍기는 냄새다.
- 이럴땐 데이터 근처로 옮기거나, 독립함수로 뺀다음 원하는 모듈로 보내주면 된다.
- 어디로 옮길지 명확하지 않을 때는 가장 많은 데이터를 포함한 모듈로 옮긴다. 함수 추출하기로 함수를 나눈 후 각각을 적합한 모듈로 옮기면 더 쉽게 해결되기도 한다.
- 위 두가지 경우가 아닌경우 전략패턴, 방문자 패턴을 적용할 수도 있다.
- 전략 패턴과 방문자 패턴을 적용하면 오버라이드해야 할 소량의 동작 코드를 각각의 클래스로 격리해주므로 수정하기가 쉬워진다.

## 데이터 뭉치

- 데이터는 뭉쳐 다녀야한다. 클래스 여러 개의 필드에서, 여러 메서드의 시그니처에서 발견된다면 보금자리를 마련해주자.
- 먼저 `클래스 추출하기`로 하나의 객체로 묶는다.
- 메서드 시그니처에 있는 데이터 뭉치는 `매개변수 객체 만들기`나 `객체 통째로 넘기기`를 적용해서 매개변수 수를 줄여본다.
- 데이터 뭉치인지 판별하려면 값 하나를 삭제해보자.
- `클래스`로 만들기를 권한다. 클래스는 좋은 향기를 흩뿌릴 기회를 만든다.

## 기본형 집착

- 프로그래머 중에는 상황에 맞는 타입(화폐, 좌표, 구간)을 직접 정의하기 꺼리는 사람이 많다. 이러면 악취가 난다.
- `기본형을 객체로 바꾸기`를 적용하자.
- 기본형으로 표현된 코드가 조건부 동작을 제어하는 타입 코드로 쓰였다면 `타입 코드를 서브클래스로 바꾸기`와 `조건부 로직을 다형성으로 바꾸기`를 적용하자.

## 반복되는 switch문

- 과거 어떤 이들은 switch문은 모조리 `조건부 로직을 다형성으로 바꾸기`로 없애야 할 대상이라고 주장했다.
- 지금은 다형성이 자리를 잡았기 때문에 무조건 switch문을 없앨필요는 없다.
- 이제는 중복된 switch case문(if else문)에 집중해보자.

## 반복문

- `반복문을 파이프라인으로 바꾸기`를 적용해서 시대에 걸맞지 않은 반복문을 제거하자.(filter, map)

## 성의 없는 요소

- 의미없는 함수나 메서드가 하나인 클래스들이 있다. 여러 이유가 있을 수 있지만 `함수 인라인하기`, `클래스 인라인하기`, `계층 합치기` 등을 적용해서 보내주자.

## 추측성 일반화

- 나중에 필요하다고 생각해서 필요없는 부분을 고려해서 만든 코드.
- 다 없애자.

## 임시 필드

- 임시 필드를 가져야하는 클래스도 있다. 이렇게 덩그러니 떨어져 있는 필드를 발견하면 `클래스 추출하기`, `함수 옮기기`로 클래스를 만들어주자.
- 임시 필드들이 유효한지를 확인한 후 동작하는 조건부 로직이 있을 수 있는데, `특이 케이스 추가하기`로 대안 클래스를 만들어서 제거할 수 있다.(학습필요)

## 메시지 체인

- 학습 필요

## 중재자

- 객체지향에서는 캡슐화를 사용한다. 그리고 캡슐화하는 과정에서는 위임이 자주 활용된다.
- 하지만 지나치면 문제가 된다.

## 내부자 거래

- 개발자는 모듈 사이에 벽을 두껍게 세우기를 좋아하며, 모듈 사이에 데이터 거래가 많으면 결합도가 높아진다고 투덜댄다.
- `함수 옮기기`와 `필드옮기기`로 사적인 처리를 없애자.
- 관심사를 공유한다면 공통 부분을 정식으로 처리하는 `제3의 모듈`을 새로 만들거나 `위임 숨기기`를 이용하여 다른 모듈이 `중간자` 역할을 하게 만든다.(코드스피츠 테트리스, 1장 예시 생각)
- 자식이 부모 품을 떠나야한다면 `서브클래스를 위임으로 바꾸기`나 `슈퍼클래스를 위임으로 바꾸기`를 활용하자.

## 거대한 클래스

- 클래스에 필드가 많아지면 `클래스 추출하기`로 필드들 일부를 묶는다. 그리고 같은 컴포넌트에 묶어두자. ex) depositAmount depositCurrency 필드, 접두어나 접미어가 같은 필드
- 이렇게 분리할 컴포넌트를 원래 클래스와 상속 관계로 만드는 게 좋다면 추출하기보다 `슈퍼 클래스 추출하기`나 `타입 코드를 서브클래스로 바꾸기`를 적용하는게 더 쉽다.
- 코드량이 너무 많은 클래스는 일단 중복을 제거하자
- 클라이언트들이 거대 클래스를 이용하는지 패턴을 파악하여 쪼갤 단서를 얻자.
- 먼저 클라인트들이 거대 클래스의 특정 기능 그룹만 주로 사용하는지 살핀다. 유용한 기능 그룹을 찾았다면 `클래스 추출하기`, `슈퍼 클래스 추출하기`, `타입 코드를 서브 클래스로 바꾸기`등을 활용해서 여러 클래스로 분리한다.
  (잘 모르겠다아직)

## 서로 다른 인터페이스의 대안 클래스들

- 클래스를 사용할 때의 큰 장점은 언제든 다른 클래스로 교체할 수 있다는 것이다.(인터페이스 같을 때)
- 따라서 `함수 선언 바꾸기`, `함수 옮기기`로 인터페이스가 같아질 때까지 필요한 동작들을 클래스 안으로 밀어 넣는다.
- 대안 클래스들 사이에 중복 코드가 생기면 `슈퍼클래스 추출하기`를 적용할지 고려

## 데이터 클래스

데이터 클래스란 데이터 필드와 게터/세터 메서드로만 구성된 클래스다.
public 필드가 있다면 `레코드 캡슐화하기`로 숨기자. 변경하면 안 되는 필드는 `세터 제거하기`로 접근을 원천 봉쇄한다.
모르겠다. 뭐라는건지...

## 상속 포기

서브클래스가 부모의 유산을 원치 않거나 필요 없는 경우.

- 같은 계층에 서브클래스를 하나 새로 만들고, `메서드 내리기`와 `필드내리기`를 활용해서 물려받지 않을 부모 코드를 모조리 새로 만든 서브 클래스로 넘긴다.
- 일부 동작을 재활용하기 위한 목적으로 상속을 활용하기도 하는데, 실무 관점에서 아주 유용한 방식이다. 냄새를 풍기지만 보통은 참을만하다.
- 상속 포기 냄새는 서브클래스가 부모의 동작은 필요로하지만 인터페이스는 따르고 싶지 않을 때 특히 심하게 난다. 이때 `서브클래스를 위임으로 바꾸기`, `슈퍼클래스를 위임으로 바꾸기`를 활용해서 상속 메커니즘에서 벗어나자.

## 주석

- 주석은 악취가 아닌 향기를 입힌다. 근데 사실 주석이 많으면 악취를 풍기는 경우가 많다. 실제로 리팩터링으로 냄새를 걷어내면 상당량의 주석이 사라진다.
- (그럼에도 부루구하고 주석은 필요하다. 근본적인 원인을 해결하는게 베스트지만 경우에 따라서 그러지 못할때가 있다. 그럴때는 주석을 쓰자)
- 주석을 남기고 싶다면 `함수 추출하기`를 먼저 적용해보자. 이미 적용했는데도 설명이 필요하다면 `함수 선언 바꾸기`로 함수 이름을 바꿔보자.
- 시스템이 동작하기 위한 선행조건을 명시하고 싶다면 `어서션 추가하기`가 대기하고 있다.(학습 필요)
  > 주석을 남겨야겠다는 생각이 들면, 가장 먼저 주석이 필요 없는 코드로 리팩터링해본다.
