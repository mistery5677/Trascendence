import { Controller, Post, Body } from '@nestjs/common';
import { MatchesService } from './matches.service';

// @Controller('matches')
// export class MatchesController {
//   constructor(private readonly matchesService: MatchesService) {}

//   @Post('end')
//   async saveMatchResult(
//     @Body() body: { playerAId: number; playerBId: number; result: string }
//   ) {
//     // Return all the information
//     return this.matchesService.saveMatchResult(
//       body.playerAId, 
//       body.playerBId, 
//       body.result
//     );
//   }
// }