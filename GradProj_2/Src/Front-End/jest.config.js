export default  {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS files
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/jest.fileMock.js", // Mock image files
  },
};
