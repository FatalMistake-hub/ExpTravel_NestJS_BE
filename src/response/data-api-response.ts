import { Exclude, Expose } from 'class-transformer';

export class ResponseDataAPI {
  @Expose()
  status: string;

  @Expose()
  data?: any;

  @Expose()
  error?: any;

  @Expose()
  meta?: any;

  constructor(partial: Partial<ResponseDataAPI>) {
    Object.assign(this, partial);
  }

  static success(data: any, meta?: any): ResponseDataAPI {
    return new ResponseDataAPI({ status: 'SUCCESS', data, meta });
  }

  static successWithoutMeta(data: any): ResponseDataAPI {
    return new ResponseDataAPI({ status: 'SUCCESS', data });
  }

  static error(error: any): ResponseDataAPI {
    return new ResponseDataAPI({ status: 'FAILURE', error });
  }
}
