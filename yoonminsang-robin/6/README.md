# 기본적인 리팩터링

## 함수 추출하기

### 절차

1. 함수를 새로 만들고 목적을 잘 드러내는 이름을 붙인다.(`어떻게`가 아닌 `무엇을` 하는지가 드러나야한다).
2. 추출할 코드를 원본 함수에서 복사하여 새 함수에 붙여넣는다.
3. 추출한 코드 중 원본 함수를 지역 변수를 참조하거나 추출한 함수의 유효범위를 벗어나는 변수는 없는지 검사한다. 있다면 매개변수로 전달한다.
4. 변수를 다 처리했다면 컴파일한다.
5. 원본 함수에서 추출한 새로 만든 함수를 호출하는 문장으로 바꾼다(즉, 추출한 함수로 일을 위임한다).
6. 테스트한다.
7. 다른 코드에 방금 추출한 것과 똑같거나 비슷한 코드가 없는지 살핀다. 있다면 방금 추출한 새 함수를 호출하도록 바꿀지 검토한다.(인라인 코드를 함수 호출로 바꾸기).

### 예시

- 유효범위를 벗어나는 변수가 없을 때
- 지역 변수를 사용할 때
- 지역 변수의 값을 변경할 때

## 함수 인라인하기

### 절차

1. 다형 메서드인지 확인한다.
2. 인라인할 함수를 호출하는 곳을 모두 찾는다.
3. 각 호출문을 함수 본문으로 교체한다.
4. 하나씩 교체할 때마다 테스트한다.
5. 함수 정의(원래 함수)를 삭제한다.

## 변수 추출하기

### 절차

1. 추출하려는 표현식에 부작용은 없는지 확인한다.
2. 불변 변수를 하나 선언하고 이름을 붙일 표현식의 복제본을 대입한다.
3. 원본 표현식을 새로 만든 변수로 교체한다.
4. 테스트한다.
5. 표현식을 여러 곳에서 사용한다면 각각을 새로 만든 변수로 교체한다. 하나 교체할 때마다 테스트한다.

## 변수 인라인하기

### 절차

1. 대입문의 우변(표현식)에서 부작용이 생기지는 않는지 확인한다.
2. 변수가 불변으로 선언되지 않았다면 불변을 만든 후 테스트한다.
3. 이 변수를 가장 처음 사용하는 코드를 찾아서 대입문 우변의 코드로 바꾼다.
4. 테스트한다.
5. 변수를 사용하는 부분을 모두 교체할 때까지 이 과정을 반복한다.
6. 변수 선언문과 대입문을 지운다.
7. 테스트한다.

## 함수 선언 바꾸기

- 함수의 이름을 바꾸는 경우와 매개변수를 변경하는 경우에 해당한다.
- 다른 리팩터링과는 다르게 이 문제는 정답이 없다. 지속적인 리팩터링이 필요하다.

### 간단한 절차

1. 매개변수를 제거하려거든 먼저 함수 본문에서 제거 대상 매개변수를 참조하는 곳은 없는지 확인한다.
2. 메서드 선언을 원하는 형태로 바꾼다.
3. 기존 메서드 선언을 참조하는 부분을 모두 찾아서 바뀐 형태로 수정한다.
4. 테스트한다.

- 이름 변경과 매개변수 추가를 모두 하고 싶다면 독립적으로 처리

### 마이그레이션 절차

1. 이어지는 추출 단계를 수월하게 만들어야 한다면 함수의 본문을 적절히 리팩터링한다.
2. 함수 본문을 새로운 함수로 추출한다.
   => 새로 만들 함수 이름이 기존 함수와 같다면 일단 검색하기 쉬운 이름을 임시로 붙여둔다.
3. 추출한 함수에 매개변수를 추가해야 한다면 '간단한 절차'를 따라 추가한다.
4. 테스트한다.
5. 기존 함수를 인라인한다.
6. 이름을 임시로 붙여뒀다면 함수 선언 바꾸기를 한 번 더 적용해서 원래 이름으로 되돌린다.
7. 테스트한다.

- 임시 함수를 만드는 방법을 가끔 썼었는데 좋은 방법인것같다. 한번에 지우거나 바꾸는데는 위험성이 큰데 임시 함수를 만들면 그런 문제점이 사라진다.

#### 예시

- 리팩토링 이전 코드

```
function inNewEngland(aCustomer){
    return ['MA','CT','ME','VT','NH','RI'].includes(aCustomer.address.state);
}
const newEnglanders = someCustomers.filter(c=>inNewEngland(c));
```

- 단계1

```
function inNewEngland(aCustomer){
    const stateCode = aCustomer.address.state;
    return ['MA','CT','ME','VT','NH','RI'].includes(stateCode);
}
```

- 단계2

```
function inNewEngland(aCustomer){
    const stateCode = aCustomer.address.state;
    return xxNEWinNewEngland(stateCode);
}
function xxNEWinNewEngland(stateCode){
    return ['MA','CT','ME','VT','NH','RI'].includes(stateCode);
}
```

- 단계3

```
function inNewEngland(aCustomer){
    return xxNEWinNewEngland(aCustomer.address.state);
}
```

- 단계4

```
const newEnglanders = someCustomers.filter(c=>xxNEWinNewEngland(c.address.state));
```

- 단계5

```
const newEnglanders = someCustomers.filter(c=>inNewEngland(c.address.state));
function inNewEngland(stateCode){
    return ['MA','CT','ME','VT','NH','RI'].includes(stateCode);
}
```

## 변수 캡슐화하기

### 절차

1. 변수로의 접근과 갱신을 전담하는 캡슐화 함수들을 만든다.
2. 정적 검사를 수행한다.
3. 변수를 직접 참조하던 부분을 모두 적절한 캡슐화 함수 호출로 바꾼다. 하나씩 바꿀 때마다 테스트한다.
4. 변수로의 접근 범위를 제한한다.
   => 변수로의 직접 접근을 막을 수 없을 때도 있다. 그럴 때는 변수 이름을 바꿔서 테스트해보면 해당 변수를 참조하는 곳을 쉽게 찾아낼 수 있다.
5. 테스트한다.
6. 변수 값이 레코드라면 레코드 캡슐화하기를 적용할지 고려해본다.

- 예시(레코드 캡슐화하기))

```
let defaultOwnerData = {firstName:'마틴',lastName:'파울러'};
export function defaultOwner(){
    return new Person(defaultOwnerData);
}
export function setDefaultOwner(arg){
    defaultOwnerData = arg;
}

class Person{
    constructor(data){
        this._lastName=data.lastName;
        this._firstName=data.firstName;
    }
    get lastName(){
        return this._lastName;
    }
    get firstName(){
        return this._firstName;
    }
}
```

- getter에서 데이터를 복제했는데 setter에서도 복제본을 만드는 편이 좋을 수도 있다.

## 변수 이름 바꾸기

1. 폭넓게 쓰이는 변수라면 변수 캡슐화하기를 고려한다.
2. 일믕르 바꿀 변수를 참조하는 곳을 모두 찾아서, 하나씩 변경한다.
   => 다른 코드베이스에서 참조하는 변수는 외부에 공개된 변수이므로 이 리팩터링을 적용할 수 없다.
   => 변수 값이 변하지 않는다면 다른 이름으로 복제본을 만들어서 하나씩 점진적으로 변경한다. 하나씩 바꿀 때마다 테스트한다.
3. 테스트한다.

- 예시1
  변수를 먼저 캡슐화하고 그 이후에 변수 이름을 바꾼다.

```
function title(){return tpHd;}
function setTitle(arg){tpHd=arg;}
```

- 예시2(상수 이름 바꾸기)
  원본의 이름을 바꾼 후, 원본의 원래 이름(기존 이름)과 같은 복제본을 만든다. 사실 코드레벨에서 한번에 바꿀수있지만 여러사람이 각자 브랜치에서 작업하는 경우도 있기 때문에 좋은 것같다. 실제로 한 브랜치에서 바꿔버리면 브랜치를 merge 할 때 conflict이 나는 경우가 많다.

```
const companyName = '애크미 구스베리';
/** @deprecated  */
const cpNm = companyName;
```

## 매개변수 객체 만들기
