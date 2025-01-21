import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EditNote } from '../components/EditNote';
import { getNotes, updateNote } from '../api';

// Mock an API to get and update notes
jest.mock('../api', () => ({
  getNotes: jest.fn(), // Mock the function to get notes
  updateNote: jest.fn(), // Mock the function to update notes
}));

// Mock react-router-dom: useParams returns id, and useNavigate returns mock function
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom'); // Preserving original functions
  return {
    ...actual,
    useParams: () => ({ id: '1' }), // Returning the Mocked id
    useNavigate: () => mockedNavigate, // Return  mock function for transitions
  };
});

// Before each test,clean up mock functions
beforeEach(() => {
  jest.clearAllMocks();
  mockedNavigate.mockClear();
});

// Description of tests for the EditNote component
describe('EditNote Component', () => {
  // Create a mocked note object
  const mockNote = {
    _id: '1',
    title: 'Test Title',
    content: 'Test Content',
    category: 'Test Category',
  };

  // Testing component rendering with initial values ​​from API
  test('renders the component with initial values', async () => {
    // Mock successful receipt of note data
    getNotes.mockResolvedValue([mockNote]);

    render(
      <BrowserRouter>
        <EditNote />
      </BrowserRouter>
    );

    // Wait until the note data is displayed in the input fields.
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title').value).toBe('Test Title');
      expect(screen.getByPlaceholderText('Content').value).toBe('Test Content');
      expect(screen.getByPlaceholderText('Category').value).toBe('Test Category');
    });
  });

  // Testing a successful note update
  test('handles form submission successfully', async () => {
    // Mock up successful receipt of the note and successful update
    getNotes.mockResolvedValue([mockNote]);
    updateNote.mockResolvedValue({});

    render(
      <BrowserRouter>
        <EditNote />
      </BrowserRouter>
    );

    // Make sure the data is loaded
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title').value).toBe('Test Title');
    });

    // Changing data in form fields
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Updated Title' },
    });
    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'Updated Content' },
    });
    fireEvent.change(screen.getByPlaceholderText('Category'), {
      target: { value: 'Updated Category' },
    });

    // Adding a file via file-input
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Click on the "Save" button
    fireEvent.click(screen.getByText('Save'));

    // Expect updateNote to be called with the correct arguments
    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith('1', expect.any(FormData));
    });

    // Check that a success message is displayed and that the transition to '/home' is performed
    await waitFor(() => {
      expect(screen.getByText('Note updated successfully')).toBeInTheDocument();
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  // Testing error handling when updating a note
  test('handles form submission failure', async () => {
    // Mock up successful receipt of a note and an error during the update
    getNotes.mockResolvedValue([mockNote]);
    updateNote.mockRejectedValue(new Error('Failed to update'));

    render(
      <BrowserRouter>
        <EditNote />
      </BrowserRouter>
    );

    // Make sure the data is loaded
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title').value).toBe('Test Title');
    });

    // Click on the "Save" button without changing the data
    fireEvent.click(screen.getByText('Save'));

    // Check that updateNote was called
    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith('1', expect.any(FormData));
    });

    // Make sure that an error message is displayed.
    await waitFor(() => {
      expect(screen.getByText('Error updating note')).toBeInTheDocument();
    });
  });

  // Testing the return to the main page when clicking the "Back to Home" button
  test('navigates back to home on "Back to Home" button click', () => {
    render(
      <BrowserRouter>
        <EditNote />
      </BrowserRouter>
    );

    // Click on the "Back to Home" button
    fireEvent.click(screen.getByText('Back to Home'));

    // Check that navigate is called from '/home'
    expect(mockedNavigate).toHaveBeenCalledWith('/home');
  });
});
