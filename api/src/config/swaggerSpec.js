const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Financely API',
    version: '1.0.0',
    description: 'Documentación interactiva de la API Backend de Financely. Gestiona la autenticación de usuarios, administración de hogares familiares y la sincronización delta offline-first.',
    contact: {
      name: 'Equipo Financely'
    }
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Servidor de desarrollo local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese su Token JWT obtenido de /api/auth/login o /api/auth/register'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Household: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          inviteCode: { type: 'string', example: 'A8B9C0' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      HouseholdMember: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          householdId: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          avatar: { type: 'string', nullable: true },
          color: { type: 'string', nullable: true },
          isDeleted: { type: 'boolean' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          householdId: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          icon: { type: 'string' },
          type: { type: 'string', enum: ['EXPENSE', 'INCOME'] },
          budgetLimit: { type: 'number' },
          color: { type: 'string', nullable: true },
          isDeleted: { type: 'boolean' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          householdId: { type: 'string', format: 'uuid' },
          amount: { type: 'number' },
          type: { type: 'string', enum: ['EXPENSE', 'INCOME'] },
          categoryId: { type: 'string', format: 'uuid' },
          memberId: { type: 'string', format: 'uuid' },
          date: { type: 'string', format: 'date-time' },
          note: { type: 'string', nullable: true },
          isDeleted: { type: 'boolean' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      SyncPayload: {
        type: 'object',
        required: ['householdId'],
        properties: {
          householdId: { type: 'string', format: 'uuid' },
          lastSyncedAt: { type: 'string', format: 'date-time', nullable: true },
          changes: {
            type: 'object',
            properties: {
              members: { type: 'array', items: { $ref: '#/components/schemas/HouseholdMember' } },
              categories: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
              transactions: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } }
            }
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Verificación del estado del servidor',
        tags: ['Sistema'],
        responses: {
          '200': {
            description: 'Servidor activo y respondiendo correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        summary: 'Registrar un nuevo usuario',
        tags: ['Autenticación'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', example: 'usuario@familia.com' },
                  password: { type: 'string', example: 'Password123' },
                  name: { type: 'string', example: 'Juan Pérez' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Usuario registrado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' }
                  }
                }
              }
            }
          },
          '400': { description: 'Datos inválidos o el email ya está registrado' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Iniciar sesión y obtener Token JWT',
        tags: ['Autenticación'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'usuario@familia.com' },
                  password: { type: 'string', example: 'Password123' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login exitoso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': { description: 'Credenciales inválidas' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        summary: 'Obtener información del usuario autenticado',
        tags: ['Autenticación'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Perfil del usuario retornado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          '401': { description: 'No autorizado' }
        }
      }
    },
    '/api/households': {
      post: {
        summary: 'Crear un nuevo Hogar familiar',
        tags: ['Hogares'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Hogar Familia Pérez' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Hogar creado exitosamente con código de invitación único',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Household' }
              }
            }
          }
        }
      }
    },
    '/api/households/join': {
      post: {
        summary: 'Unirse a un Hogar existente con un código de invitación',
        tags: ['Hogares'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['inviteCode'],
                properties: {
                  inviteCode: { type: 'string', example: 'A8B9C0' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Unido exitosamente al hogar' },
          '404': { description: 'Código de invitación inválido o no encontrado' }
        }
      }
    },
    '/api/households/{id}/summary': {
      get: {
        summary: 'Obtener resumen consolidado del Hogar (Ingresos vs Gastos vs Saldo)',
        tags: ['Hogares'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID del Hogar'
          }
        ],
        responses: {
          '200': {
            description: 'Resumen consolidado del hogar',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    inviteCode: { type: 'string' },
                    totalIncome: { type: 'number' },
                    totalExpense: { type: 'number' },
                    balance: { type: 'number' },
                    memberCount: { type: 'integer' },
                    categoryCount: { type: 'integer' },
                    transactionCount: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/sync': {
      post: {
        summary: 'Sincronizar cambios locales (Offline-First Delta Sync)',
        tags: ['Sincronización'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SyncPayload' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Sincronización completada con éxito. Retorna actualizaciones recibidas desde el servidor.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    syncedAt: { type: 'string', format: 'date-time' },
                    updates: {
                      type: 'object',
                      properties: {
                        members: { type: 'array', items: { $ref: '#/components/schemas/HouseholdMember' } },
                        categories: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
                        transactions: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
