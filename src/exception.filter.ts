import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    if (status === 400) {
      const errorsResponse = {
        errorMessages: [],
      }
      const responseBody: any = exception.getResponse()
      if (typeof responseBody.message === 'object') {
        responseBody.message.forEach(e => errorsResponse.errorMessages.push(e))
      } else {
        errorsResponse.errorMessages.push(responseBody.message)
      }
      response.status(status).json(errorsResponse)
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      })
    }
  }
}
