/* eslint-env node */
function reportFile() {
  if (_circleTestFolder()) {
    return _circleTestFolder() + '/test.xml';
  }
}

function testReporter() {
  return _circleTestFolder() ? 'xunit' : 'tap';
}

function _circleTestFolder() {
  return process.env['CIRCLE_TEST_REPORTS'];
}

module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: [
    "Chrome",
  ],
  launch_in_dev: [
    'Firefox',
    'Chrome'
  ],
  "reporter": testReporter(),
  "report_file": reportFile(),
  "xunit_intermediate_output": true
};
