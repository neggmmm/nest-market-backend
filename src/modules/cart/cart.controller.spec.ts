import { Test, TestingModule } from '@nestjs/testing';
import { AddCartItem } from './application/use-case/add-item.use-case';
import { DeleteCart } from './application/use-case/delete-cart.use-case';
import { GetCart } from './application/use-case/get-cart.use-case';
import { RemoveItem } from './application/use-case/remove-item.use-case';
import { UpdateQuantity } from './application/use-case/update-quantity.use-case';
import { AuthGuard } from '../auth/presentation/http/guard/auth.guard';
import { CartController } from './presentation/cart.controller';

// Test helper: keeps controller tests focused on HTTP wiring, not use-case internals.
const useCaseMock = {
  execute: jest.fn(),
};

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        // Mocked use cases: controller dependencies are supplied without TypeORM.
        { provide: AddCartItem, useValue: useCaseMock },
        { provide: GetCart, useValue: useCaseMock },
        { provide: UpdateQuantity, useValue: useCaseMock },
        { provide: RemoveItem, useValue: useCaseMock },
        { provide: DeleteCart, useValue: useCaseMock },
      ],
    })
      // Guard override: auth is covered elsewhere, so this spec can instantiate cleanly.
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
