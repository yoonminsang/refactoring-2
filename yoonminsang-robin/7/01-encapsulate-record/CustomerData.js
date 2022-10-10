import customerData from './data';

// 중첩된 레코드 캡슐화하기

/**
 * before
 */

// 쓰기 예
customerData[customerID].usages[year][month] = amount;

// 읽기 예
function compareUsage(customerID, laterYear, month) {
  const later = customerData[customerID].usages[laterYear][month];
  const earlier = customerData[customerID].usages[laterYear - 1][month];

  return {
    lateAmount: later,
    chnage: later - earlier,
  };
}

/**
 * after
 */
function getCustomerData() {
  return customerData;
}

function getRawDataOfCustomers() {
  return customerData.rawData;
}

function setRawDataOfCustomers(arg) {
  customerData = new CustomerData(arg);
}

// 쓰기 예
getRawDataOfCustomers().setUsage(customerID, year, month, amount);

// 읽기 예
function compareUsage(customerID, laterYear, month) {
  const later = getCustomerData().rawData[customerID].usages[laterYear][month];
  const earlier =
    getCustomerData().rawData[customerID].usages[laterYear - 1][month];

  return {
    lateAmount: later,
    chnage: later - earlier,
  };
}
