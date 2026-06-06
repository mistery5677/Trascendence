import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as readline from 'readline';

@Injectable()
export class StockfishService implements OnModuleDestroy {
  private engine: ChildProcessWithoutNullStreams | null = null;
  private rl: readline.Interface | null = null;

  private ensureEngine(level = 5) {
    if (this.engine) return;

    const bin = process.env.STOCKFISH_PATH || '/usr/bin/stockfish';
    this.engine = spawn(bin, [], { stdio: 'pipe' });
    this.rl = readline.createInterface({ input: this.engine.stdout });

    if (!this.engine || !this.rl) throw new Error('Stockfish not started');

    const send = (cmd: string) => this.engine!.stdin.write(cmd + '\n');
    const safeLevel = Math.max(0, Math.min(20, level));

    send(`setoption name Skill Level value ${safeLevel}`);
    send('isready');
  }

  async getBestMove(fen: string, level = 5, moveTimeMs = 400): Promise<string> {
    this.ensureEngine(level);

    if (!this.engine || !this.rl) throw new Error('Stockfish not started');

    const send = (cmd: string) => this.engine!.stdin.write(cmd + '\n');

    return new Promise<string>((resolve, reject) => {
      let settled = false;

      const cleanup = () => {
        clearTimeout(timeout);
        this.rl?.off('line', onLine);
      };

      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error('Stockfish timeout'));
      }, moveTimeMs + 3000);

      const onLine = (line: string) => {
        if (!line.startsWith('bestmove')) return;

        const move = line.split(' ')[1];
        if (!move || move === 'none') {
          if (settled) return;
          settled = true;
          cleanup();
          reject(new Error('Stockfish returned no move'));
          return;
        }

        if (settled) return;
        settled = true;
        cleanup();
        resolve(move);
      };

      this.rl?.on('line', onLine);

      send('uci');
      send('isready');
      send(`position fen ${fen}`);
      send(`go movetime ${moveTimeMs}`);
    });
  }

  stopEngine() {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }

    if (this.engine) {
      this.engine.kill();
      this.engine = null;
    }
  }

  onModuleDestroy() {
    this.stopEngine();
  }
}
