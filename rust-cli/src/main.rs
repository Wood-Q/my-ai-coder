extern crate colored;
use clap::{Parser, ValueEnum};
use colored::Colorize;

#[derive(Clone, Copy, Debug, ValueEnum)]
enum Action {
    Start,
    Quit,
}

#[derive(Parser, Debug)]
#[command(version,about,long_about = None)]
struct Args {
    #[arg(short, long, value_enum)]
    action: Action,

    #[arg(short, long, default_value = "world")]
    name: String,

    #[arg(short, long, default_value_t = 1)]
    count: u8,
}

fn main() {
    let args = Args::parse();
    match args.action {
        Action::Start => {
            for _ in 0..args.count {
                println!("{} {}", "Hello".green().bold(), args.name.green().bold());
            }
        }
        Action::Quit => println!("{}", "Quitting...".red().bold()),
    }
}
