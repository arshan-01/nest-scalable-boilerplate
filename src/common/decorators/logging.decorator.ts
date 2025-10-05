import { Logger } from '@nestjs/common';

export function LogMethod(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  const logger = new Logger(target.constructor.name);

  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    logger.log(`Method ${propertyName} called with args: ${JSON.stringify(args)}`);
    
    try {
      const result = await method.apply(this, args);
      const duration = Date.now() - start;
      logger.log(`Method ${propertyName} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`Method ${propertyName} failed after ${duration}ms: ${error.message}`);
      throw error;
    }
  };
}

export function LogExecution(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  const logger = new Logger(target.constructor.name);

  descriptor.value = function (...args: any[]) {
    logger.log(`Executing ${propertyName}`);
    const result = method.apply(this, args);
    logger.log(`Completed ${propertyName}`);
    return result;
  };
}
