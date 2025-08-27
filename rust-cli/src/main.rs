use clap::{Parser, Subcommand};
use std::path::Path;
use std::process::Command;

#[derive(Parser)]
#[command(name = "maco", about = "mini claude code cli (using rust and python)")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    Ask { question: String },
}

fn run_python(args: &[&str]) {
    // 优先使用 code-play 的虚拟环境解释器，否则回退系统 python3
    let venv_python = "../code-play/.venv/bin/python";
    let python = if Path::new(venv_python).exists() {
        venv_python
    } else {
        "python3"
    };
    let output = Command::new(python)
        .current_dir("../code-play")
        .args(args)
        .output()
        .expect("Failed to execute process");
    print!("{}", String::from_utf8_lossy(&output.stdout));
    eprint!("{}", String::from_utf8_lossy(&output.stderr));
}

fn main() {
    let cli = Cli::parse();
    match cli.command {
        Commands::Ask { question } => {
            run_python(&["main.py", &question]);
        }
    }
}
