# 기능 이동

## 함수 옮기기

### 절차

1. 선택한 함수가 현재 컨텍스트에서 사용 중인 모든 프로그램 요소를 살펴본다. 이 요소들 중에도 함께 옮겨야 할 게 있는지 고민해본다.
   => 호출되는 함수 중 함께 옮길 게 있다면 대체로 그 함수를 먼저 옮기는 게 낫다. 얽혀 있는 함수가 여러 개라면 다른 곳에 미치는 영향이 적은 함수부터 옮기도록 하자.
   => 하위 함수들의 호출자가 고수준 함수 하나뿐이면 먼저 하위 함수들을 고수준 함수에 인라인한 다음, 고수준 함수를 옮기고 옮긴 위치에서 개별 함수들로 다시 추출하자.
2. 선택한 함수가 다형 메서드인지 확인한다.
   => 객체 지향 언어에서는 같은 메서드가 슈퍼클래스나 서브클래스에도 선언되어 있는지까지 고려해야 한다.
3. 선택한 함수를 타깃 컨텍스트로 복사한다(이때 원래의 함수를 소스 함수라 하고 복사해서 만든 새로운 함수를 타깃 함수라 한다.) 타깃 함수가 새로운 터전에 잘 자리 잡도록 다듬는다.
   => 함수 본문에서 소스 컨텍스트의 요소를 사용한다면 해당 요소들을 매개변수로 넘기거나 소스 컨텍스트 자체를 참조로 넘겨준다.
   => 함수를 옮기게 되면 새로운 컨텍스트에 어울리는 새로운 이름을 바꿔줘야 할 경우가 많다. 필요하면 바꿔준다.
4. 정적 분석을 수행한다.
5. 소스 컨텍스트에서 타깃 함수를 참조할 방법을 찾아 반영한다.
6. 소스 함수를 타깃 함수의 위임 함수가 되도록 수정한다.
7. 테스트한다.
8. 소스 함수를 인라인할지 고민해본다.
   => 소스 함수는 언제까지라도 위임 함수로 남겨둘 수 있다. 하지만 소스 함수를 호출하는 곳에서 타깃 함수를 직접 호출하는 데 무리가 없다면 중간 단계(소스 함수)는 제거하는 편이 낫다.

## 필드 옮기기

- 프로그램의 상당 부분이 동작을 구현하는 코드로 이뤄지지만 프로그램의 진짜 히은 데이터 구조에서 나온다.
- 하지만 제대로 하기가 정말 어렵다.
- 가장 적합한 데이터 구조를 알아내고자 프로젝트 초기에 분석을 해본 결과, 경험과 도메인 주도 설계 같은 기술이 내 능력을 개선해줌을 알았다.
- 하지만 그럼에도 불구하고 초기 설계에서 실수가 빈번했다.
- 오늘까지는 합리적일지라도 다음주에는 잘못된 것으로 판명나곤한다.
- 현재 데이터 구조가 적절치 않음을 깨닫게 되면 곧바로 수정해야 한다.

### 절차

1. 소스 필드가 캡슐화되어 있지 않다면 캡슐화한다.
2. 테스트한다.
3. 타깃 객체에 필드(와 접근자 메서드들)을 생성한다.
4. 정적 검사를 수행한다.
5. 소스 객체에서 타깃 객체를 참조할 수 있는지 확인한다.
   => 기존 필드나 메서드 중 타깃 객체를 넘겨주는 게 있을지 모른다. 없다면 이런 기능의 메서드를 수비게 만들 수 있는지 살펴본다. 간단치 않다면 타깃 객체를 저장할 때 새 필드를 소스 객체에 생성하자. 이는 영구적인 변경이 되겠지만, 더 넓은 맥락에서 리팩터링을 충분히 하고 나면 다시 없앨 수 있을 때도 있다.
6. 접근자들이 타깃 필드를 사용하도록 수정한다.
   => 여러 소스에서 같은 타깃을 공유한다면, 먼저 세터를 수정하여 타깃 필드와 소스 필드 모두를 갱신하게 하고, 이어서 일관성을 깨뜨리는 갱신을 검출할 수 있도록 어서션을 추가하자. 모든 게 잘 마무리되었다면 접근자들이 타깃 필드를 사용하도록 수정한다.
7. 테스트한다.
8. 소스 필드를 제거한다.
9. 테스트한다.

## 문장을 함수로 옮기기

- 쉽게 말해서 함수로 묶는 방법이다.

### 절차

1. 반복 코드가 함수 호출 부분과 멀리 떨어져 있다면 문장 슬라이드하기를 적용해 근처로 옮긴다.
2. 타깃 함수를 호출하는 곳이 한 곳뿐이라면, 단순히 소스 위치에서 해당 코드를 잘라내어 피호출 함수로 복사하고 테스트한다. 이 경우라면 나머지 단계는 무시한다.
3. 호출자가 둘 이상이면 호출자 중 하나에서 '타깃 함수 호출 부분과 그 함수로 옮기려는 문장들을 함께' 다른 함수로 추출한다. 추출한 함수에 기억하기 쉬운 임시 이름을 지어준다.
4. 다른 호출자 모두가 방금 추출한 함수를 사용하도록 수정한다. 하나씩 수정할 때마다 테스트한다.
5. 모든 호출자가 새로운 함수를 사용하게 되면 원래 함수를 새로운 함수 안으로 인라인한 훙 원래 함수를 제거한다.
6. 새로운 함수의 이름을 원래 함수의 이름으로 바꿔준다(함수 이름 바꾸기).
   => 더 나은 이름이 있다면 그 이름을 쓴다.

## 문장을 호출한 곳으로 옮기기

### 절차

1. 호출자가 한두 개뿐이고 피호출 함수도 간단한 단순한 상황이면, 피호출 함수의 처음(혹은 마지막)줄(들)을 잘라내어 호출자(들)로 복사해 넣는다(필요하면 적당히 수정한다). 테스트만 통과하면 이번 리팩터링은 여기서 끝이다.
2. 더 복잡한 상황에서는, 이동하지 '않길' 원하는 모든 문장을 함수로 추출한 다음 검색하기 쉬운 임시 이름을 지어준다.
   => 대상 함수가 서브클래스에서 오버라이드됐다면 오버라이드한 서브클래스들의 메서드 모두에서 동일하게, 남길 부분을 메서드로 추출한다. 이떼 남겨질 메서드의 본문은 모든 클래스에서 똑같아야한다. 그런 다음 (슈퍼클래스의 메서드만 남기고) 서브클래스들의 메서드를 제거한다.
3. 원래 함수를 인라인한다.
4. 추출된 함수의 이름을 원래 함수의 이름으로 변경한다(함수 이름 바꾸기)
   => 더 나은 이름이 떠오르면 그 이름을 사용하자.

## 인라인 코드를 함수 호출로 바꾸기

### 절차

1. 인라인 코드를 함수 호출로 대체한다.
2. 테스트한다.

## 문장 슬라이드하기

- 관련된 코드를 가까이 모이게하자
- 명령-질의 분리원칙(command-query separation)을 지켜가며 코딩(부수효과x)

### 절차

1. 코드 조각(문장들)을 이동할 목표 위치를 찾는다. 코드 조각의 원래 위치와 목표 위치 사이의 코드들을 훑어보면서, 조각을 모으고 나면 동작이 달라지는 코드가 있는지 살핀다. 다음과 같은 간섭이 있다면 이 리팩터링을 포기한다.
   => 코드 조각에서 참조하는 요소를 선언하는 문장 앞으로는 이동할 수 없다.
   => 코드 조각을 참조하는 요소의 뒤로는 이동할 수 없다.
   => 코드 조각에서 참조하는 요소를 수정하는 문장을 건너뛰어 이동할 수 없다.
   => 코드 조각이 수정하는 요소를 참조하는 요소를 건너뛰어 이동할 수 없다.
2. 코드 족가을 원래 위치에서 잘라내어 목표 위치에 붙여 놓는다.
3. 테스트한다.

## 반복문 쪼개기

- 하나의 for문에서 2개 이상의 역할을 한다면 분리하자. 불편할 수 있지만 리팩터링과 최적화를 구분하자.
- 예시코드좋은듯.

### 절차

1. 반복문을 복제해 두 개로 만든다.
2. 반복문이 중복되어 생기는 부수효과를 파악해서 제거한다.
3. 테스트한다.
4. 완료됐으면, 각 반복문을 함수로 추출할지 고민해본다.

## 반복문을 파이프라인으로 바꾸기

- 대충 map, filter쓰라는 얘기
- 예시와 같은 코드를 생각보다 자주 볼 수 있음. 그때마다 리팩터링하기

### 절차

1. 반복문에서 사용하는 컬렉션을 가리키는 변수를 하나 만든다.
   => 기존 변수를 단순히 복사한 것일 수도 있다.
2. 반복문의 첫 줄부터 시작해서, 각각의 단위 행위를 적절한 컬렉션 파이프라인 연산으로 대체한다. 이 때 컬렉션 파이프라인 연산은 1에서 만든 반복문 컬렉션 변수에서 시작하여, 이전 연산의 결과를 기초로 연쇄적으로 수행된다. 하나를 대체할 때마다 테스트한다.
3. 반복문이 모든 동작을 대체했다면 반복문 자체를 지운다.
   => 반복문이 결과를 누적 변수에 대입했다면 파이프라인의 결과를 그 누적 변수에 대입한다.

## 죽은 코드 제거하기

### 절차

1. 죽은 코드를 외부에서 참조할 수 있는 경우라면(예컨데 함수 하나가 통째로 죽었을 때) 혹시라도 호출하는 곳이 있는지 확인한다.
2. 없다면 죽은 코드를 제거한다.
3. 테스트한다.