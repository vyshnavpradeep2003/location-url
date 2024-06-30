import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders GeoLocation App', () => {
  render(<App />);
  const linkElement = screen.getByText(/GeoLocation App/i);
  expect(linkElement).toBeInTheDocument();
});

test('locate button displays an error for invalid domain', () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText('Enter domain (e.g., www.example.com)'), { target: { value: 'invalid-domain' } });
  fireEvent.click(screen.getByText('Locate'));
  expect(screen.getByText('Please enter a valid domain')).toBeInTheDocument();
});

