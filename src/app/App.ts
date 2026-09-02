import express, { type Application } from 'express';
import cors from 'cors';
import { Database } from '../config/Database';
import { envConfig } from '../config/EnvConfig';

import { UserRepository } from '../repositories/UserRepository';
import { AuthenticationRepository } from '../repositories/AuthenticationRepository';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { JobRepository } from '../repositories/JobRepository';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { BookmarkRepository } from '../repositories/BookmarkRepository';

import { PasswordHasher } from '../security/PasswordHasher';
import { TokenManager } from '../security/TokenManager';

import { UserService } from '../services/UserService';
import { AuthenticationService } from '../services/AuthenticationService';
import { CompanyService } from '../services/CompanyService';
import { CategoryService } from '../services/CategoryService';
import { JobService } from '../services/JobService';
import { ApplicationService } from '../services/ApplicationService';
import { BookmarkService } from '../services/BookmarkService';
import { ProfileService } from '../services/ProfileService';

import { UserController } from '../controllers/UserController';
import { AuthenticationController } from '../controllers/AuthenticationController';
import { CompanyController } from '../controllers/CompanyController';
import { CategoryController } from '../controllers/CategoryController';
import { JobController } from '../controllers/JobController';
import { ApplicationController } from '../controllers/ApplicationController';
import { BookmarkController } from '../controllers/BookmarkController';
import { ProfileController } from '../controllers/ProfileController';

import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';

import { UserRoutes } from '../routes/UserRoutes';
import { AuthenticationRoutes } from '../routes/AuthenticationRoutes';
import { CompanyRoutes } from '../routes/CompanyRoutes';
import { CategoryRoutes } from '../routes/CategoryRoutes';
import { JobRoutes } from '../routes/JobRoutes';
import { ApplicationRoutes } from '../routes/ApplicationRoutes';
import { BookmarkRoutes } from '../routes/BookmarkRoutes';
import { ProfileRoutes } from '../routes/ProfileRoutes';

export class App {
  private readonly express: Application;
  private readonly database: Database;

  constructor() {
    this.express = express();
    this.database = Database.getInstance();

    this.registerGlobalMiddlewares();
    this.registerRoutes();
    this.registerFallbackHandlers();
  }

  private registerGlobalMiddlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
  }

  private registerRoutes(): void {
    const userRepository = new UserRepository(this.database);
    const authenticationRepository = new AuthenticationRepository(this.database);
    const companyRepository = new CompanyRepository(this.database);
    const categoryRepository = new CategoryRepository(this.database);
    const jobRepository = new JobRepository(this.database);
    const applicationRepository = new ApplicationRepository(this.database);
    const bookmarkRepository = new BookmarkRepository(this.database);

    const passwordHasher = new PasswordHasher();
    const tokenManager = new TokenManager(
      envConfig.accessTokenKey,
      envConfig.refreshTokenKey,
      envConfig.accessTokenAge,
    );

    const userService = new UserService(userRepository, passwordHasher);
    const authenticationService = new AuthenticationService(
      userRepository,
      authenticationRepository,
      passwordHasher,
      tokenManager,
    );
    const companyService = new CompanyService(companyRepository);
    const categoryService = new CategoryService(categoryRepository);
    const jobService = new JobService(jobRepository, companyRepository, categoryRepository);
    const applicationService = new ApplicationService(applicationRepository, jobRepository);
    const bookmarkService = new BookmarkService(bookmarkRepository, jobRepository);
    const profileService = new ProfileService(
      userRepository,
      applicationRepository,
      bookmarkRepository,
    );

    const authMiddleware = new AuthMiddleware(tokenManager);

    const userController = new UserController(userService);
    const authenticationController = new AuthenticationController(authenticationService);
    const companyController = new CompanyController(companyService);
    const categoryController = new CategoryController(categoryService);
    const jobController = new JobController(jobService);
    const applicationController = new ApplicationController(applicationService);
    const bookmarkController = new BookmarkController(bookmarkService);
    const profileController = new ProfileController(profileService);

    this.express.use('/users', new UserRoutes(userController, authMiddleware).register());
    this.express.use(
      '/authentications',
      new AuthenticationRoutes(authenticationController, authMiddleware).register(),
    );
    this.express.use('/companies', new CompanyRoutes(companyController, authMiddleware).register());
    this.express.use(
      '/categories',
      new CategoryRoutes(categoryController, authMiddleware).register(),
    );
    this.express.use('/jobs', new JobRoutes(jobController, authMiddleware).register());
    this.express.use(
      '/applications',
      new ApplicationRoutes(applicationController, authMiddleware).register(),
    );
    this.express.use('/', new BookmarkRoutes(bookmarkController, authMiddleware).register());
    this.express.use('/profile', new ProfileRoutes(profileController, authMiddleware).register());
  }

  private registerFallbackHandlers(): void {
    this.express.use(ErrorMiddleware.routeNotFound);
    this.express.use(ErrorMiddleware.handle);
  }

  public getExpressApp(): Application {
    return this.express;
  }

  public listen(): void {
    this.express.listen(envConfig.port, envConfig.host, () => {
      // eslint-disable-next-line no-console
      console.log(`OpenJob API berjalan di http://${envConfig.host}:${envConfig.port}`);
    });
  }
}
