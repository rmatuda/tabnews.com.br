import { vi, describe, it, expect } from 'vitest';
import validator, { checkReservedUsernames } from 'models/validator';
import { ValidationError } from 'errors';
import webserver from 'infra/webserver';

// Mock base de webserver
vi.mock('infra/webserver.js', () => ({
  default: {
    isServerlessRuntime: false,
    host: 'https://www.tabnews.com.br'
  }
}));

// Helpers simulando erro Joi
const createMockHelpers = () => ({
  error: (message) => ({
    message,
    isJoi: true,
    details: [
      {
        message,
        context: { key: 'username.reserved' }
      }
    ]
  })
});

describe('validator model - checkReservedUsernames', () => {

  // CT1: username comum válido - ambiente não serverless (FFFF)
  it('CT1: deve permitir um username comum em ambiente não serverless', () => {
    webserver.isServerlessRuntime = false; 
    const username = 'usuarioComum';
    const helpers = {
      error: (message) => new ValidationError({ message, key: 'username', errorLocationCode: 'MOCK_ERROR' })
    };

    const result = checkReservedUsernames(username, helpers);
    expect(result).toBe(username);
  });

  // CT2: username com prefixo reservado (ex: favicon) - ambiente não serverless (FFFV)
  it('CT2: deve rejeitar username com prefixo reservado em ambiente não serverless', () => {
    webserver.isServerlessRuntime = false; 
    const username = 'faviconIcon';
    const helpers = createMockHelpers();

    const result = checkReservedUsernames(username, helpers);
    expect(result).toEqual(expect.objectContaining({ isJoi: true }));
    expect(result.details[0].context.key).toBe('username.reserved');
  });

  // CT3: username reservado geral (ex: root) - ambiente não serverless (FFVF)
  it('CT3: deve rejeitar username reservado geral em ambiente não serverless', () => {
    webserver.isServerlessRuntime = false; 
    const username = 'root';
    const helpers = createMockHelpers();

    const result = checkReservedUsernames(username, helpers);
    expect(result).toEqual(expect.objectContaining({ isJoi: true }));
    expect(result.details[0].context.key).toBe('username.reserved');
  });

  // CT4: username reservado de desenvolvimento (ex: user) - ambiente serverless (VVFF)
  it('CT4: deve rejeitar username reservado de desenvolvimento em ambiente serverless', () => {
    webserver.isServerlessRuntime = true; 
    const username = 'user';
    const helpers = createMockHelpers();

    const result = checkReservedUsernames(username, helpers);
    expect(result).toEqual(expect.objectContaining({ isJoi: true }));
    expect(result.details[0].context.key).toBe('username.reserved');
  });

  // CT5: username válido qualquer - ambiente serverless (VFFF)
  it('CT5: deve permitir username válido em ambiente serverless', () => {
    webserver.isServerlessRuntime = true; 
    const username = 'usuarioValido';
    const helpers = {
      error: (message) => new ValidationError({ message, key: 'username', errorLocationCode: 'MOCK_ERROR' })
    };

    const result = checkReservedUsernames(username, helpers);
    expect(result).toBe(username);
  });

  // CT6: username reservado de dev (ex: admin) - ambiente NÃO serverless (FVFF)
  it('CT6: deve permitir username reservado de dev em ambiente NÃO serverless', () => {
    webserver.isServerlessRuntime = false; 
    const username = 'admin'; 
    const helpers = {
      error: (message) => new ValidationError({ message, key: 'username', errorLocationCode: 'MOCK_ERROR' })
    };

    const result = checkReservedUsernames(username, helpers);
    expect(result).toBe(username);
  });
});
