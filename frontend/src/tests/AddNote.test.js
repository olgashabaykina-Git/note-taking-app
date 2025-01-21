import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AddNote } from '../components/AddNote';
import { createNote } from '../api';

// Mock the API call to create a note so it doesn't call the real server
jest.mock('../api', () => ({
  createNote: jest.fn(),
}));

// Mock `useNavigate` from `react-router-dom` to track navigation calls
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate, // Return  mocked function instead of the real `useNavigate`
  };
});

// Clean up mock functions before each test to avoid the influence of previous calls
beforeEach(() => {
  jest.clearAllMocks();
  mockedNavigate.mockClear();
});

// Description of the test suite for the AddNote component
describe('AddNote Component', () => {

  // Check that the component is rendered with an empty initial state
  test('renders the component with empty initial state', () => {
    render(
      <BrowserRouter>
        <AddNote />
      </BrowserRouter>
    );
    // Make sure that all input fields are initially empty.
    expect(screen.getByPlaceholderText('Title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Content')).toHaveValue('');
    expect(screen.getByPlaceholderText('Category')).toHaveValue('');
  });

  // Testing successful processing of form submission
  test('handles form submission successfully', async () => {
    // Mock a successful response from the API
    createNote.mockResolvedValue({});
    render(
      <BrowserRouter>
        <AddNote />
      </BrowserRouter>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'Test Content' },
    });
    fireEvent.change(screen.getByPlaceholderText('Category'), {
      target: { value: 'Test Category' },
    });

    // Upload file to input
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input'); // Using data-testid for search
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Click on the "Save" button
    fireEvent.click(screen.getByText('Save'));

    // Waiting for createNote to be called with a FormData object
    await waitFor(() => {
      expect(createNote).toHaveBeenCalledWith(expect.any(FormData));
    });

    // Check that a success message is displayed and that the transition to '/home' is performed
    await waitFor(() => {
      expect(screen.getByText('Note added successfully')).toBeInTheDocument();
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  // Testing error handling when submitting a form
  test('handles form submission failure', async () => {
    // Mock an erroneous response from the API
    createNote.mockRejectedValue(new Error('Failed to add note'));
    render(
      <BrowserRouter>
        <AddNote />
      </BrowserRouter>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'Test Content' },
    });
    fireEvent.change(screen.getByPlaceholderText('Category'), {
      target: { value: 'Test Category' },
    });

    // Click on the "Save" button
    fireEvent.click(screen.getByText('Save'));

    // Waiting for createNote to be called with a FormData object
    await waitFor(() => {
      expect(createNote).toHaveBeenCalledWith(expect.any(FormData));
    });

    // Check that an error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Error adding note')).toBeInTheDocument();
    });
  });

  // Testing the transition to the main page when clicking the "Back to Home" button
  test('navigates back to home on "Back to Home" button click', () => {
    render(
      <BrowserRouter>
        <AddNote />
      </BrowserRouter>
    );

    // Click on the "Back to Home" button
    fireEvent.click(screen.getByText('Back to Home'));

    // Check that navigate was called from '/home'
    expect(mockedNavigate).toHaveBeenCalledWith('/home');
  });
});
