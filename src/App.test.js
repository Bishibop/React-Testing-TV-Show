import React from "react";
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { fetchShow as mockFetchShow } from './api/fetchShow';

import App from './App';

jest.mock("./api/fetchShow");

const mockData = {data: {
  name: "Stranger Things",
  image: {original: 'http://static.tvmaze.com/uploads/images/original_untouched/200/501942.jpg'},
  summary: "<p>A love letter to the '80s classics that captivated a generation</p>",
  _embedded: {
    episodes: [{
      airdate: "2016-07-15",
      airstamp: "2016-07-15T12:00:00+00:00",
      airtime: "",
      id: 553946,
      image: {
        medium: "http://static.tvmaze.com/uploads/images/medium_landscape/67/168918.jpg",
        original: "http://static.tvmaze.com/uploads/images/original_untouched/67/168918.jpg"
      },
      name: "Chapter One: The Vanishing of Will Byers",
      number: 1,
      runtime: 60,
      season: 1,
      summary: "<p>A young boy mysteriously disappears, and his panicked mother demands that the police find him. Meanwhile, the boy's friends conduct their own search, and meet a mysterious girl in the forest.</p>",
      url: "http://www.tvmaze.com/episodes/553946/stranger-things-1x01-chapter-one-the-vanishing-of-will-byers"
    }]
  }
}};


test("App renders temp message when no data", ()=>{
  mockFetchShow.mockResolvedValueOnce(mockData);
  const {getByText} = render(<App />);
  expect(getByText(/fetching data/i)).toBeTruthy();
});

test("App fetches show data and renders it", async ()=>{
  mockFetchShow.mockResolvedValueOnce(mockData);
  const {getByTestId} = render(<App />);
  // This counts all occurences in the whole testing file...
  // How to make it only count calls in this specific test?
  expect(mockFetchShow).toHaveBeenCalledTimes(2);
  await waitFor(()=> {
    expect(getByTestId('showHeader')).toHaveTextContent('Stranger Things');
  });
});

test("App displays season selection", async ()=>{
  mockFetchShow.mockResolvedValueOnce(mockData);
  const {queryAllByTestId, getByText, rerender} = render(<App />);

  await waitFor(()=> {
    expect(queryAllByTestId('episode')).toHaveLength(0);
    fireEvent.click(getByText('Select a season'));
    // Why can't I get this to work?
    fireEvent.click(screen.getByText('Season 1'));
    expect(queryAllByTestId('episode')).toHaveLength(1);
  });
});
