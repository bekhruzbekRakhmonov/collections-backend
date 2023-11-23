import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, query } from 'express';
import { PaginationDto } from './common/pagination/pagination.dto';
import { APIResponse } from './common/http/response/response.api';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('search')
    async search(@Query() query: PaginationDto, @Res() res: Response) {
        const results = await this.appService.search(query);
        return APIResponse(res).statusOK(results);
    }

    @Get('search-tags')
    async searchTags(@Query() query: PaginationDto, @Res() res: Response) {
        const tags = await this.appService.searchTags(query.q);
        return APIResponse(res).statusOK(tags);
    }
}
