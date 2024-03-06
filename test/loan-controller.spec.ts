import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from '../src/loan/loan.controller';
import { LoanService } from '../src/loan/loan.service';
import { loanResponseMock } from './mocks/loan-repository.mock';

describe('LoanController', () => {
  let loanController: LoanController;
  let loanService: LoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [
        {
          provide: LoanService,
          useValue: {
            loanRequest: jest.fn().mockResolvedValue(loanResponseMock),
          },
        },
      ],
    }).compile();

    loanController = module.get<LoanController>(LoanController);
    loanService = module.get<LoanService>(LoanService);
  });

  it('Should be defined', () => {
    expect(loanController).toBeDefined();
    expect(loanService).toBeDefined();
  });

  describe('sendLoanRequest', () => {
    const body = { amount: 5000, companyId: 1 };
    const paramId = 1;
    it('should return the expected loan request data', async () => {
      const result = await loanController.sendLoanRequest(1, body);

      expect(result).toEqual(loanResponseMock);
      expect(loanService.loanRequest).toHaveBeenCalledWith(1, 5000, paramId);
    });
  });
});
