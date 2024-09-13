import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mockAxios = new MockAdapter(axios);


describe('App', () => {

  beforeEach(() => {
    mockAxios.reset();
  })

  it('should render correctly', () => {
    render(<App />);
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
  });

  it('simulates invalid form submission', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText('Nome');
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.click(submitButton);

    expect(screen.getByText('Por favor, informe o seu email')).toBeInTheDocument();
  })

  it('validates invalid email field', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('E-mail');
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'teste email não valido');
    await userEvent.click(submitButton);

    expect(screen.getByText('Por favor, informe um e-mail válido')).toBeInTheDocument();
  })

  it('should submit a valid form', async () => {
    ///AAA

    // Arrange

    mockAxios.onPost('http://localhost:3000/users').reply(200);

    render(<App />);
    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirme sua senha');

    const submitButton = screen.getByRole('button', { name: /enviar/i });

    // Act
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@gmail.com');
    await userEvent.type(passwordInput, '123');
    await userEvent.type(confirmPasswordInput, '123');

    await userEvent.click(submitButton);

    // Assert
    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('http://localhost:3000/users');
  })

})