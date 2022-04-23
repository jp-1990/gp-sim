import "@testing-library/jest-dom";

window.URL.createObjectURL = jest.fn((file)=>`/${file.name}`)