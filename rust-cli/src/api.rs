use clap::{Parser};
use std::env;
use std::io::{self,Write};

#[derive(Parser)]
struct EnvVar{
    model:String,
    api_key:String
}

pub fn check_env_var(){
    let model_env=env::var("MODEL");
    match model_env{
        Ok(value)=>println!("模型环境变量:{}",value),
        Err(e)=>println!("无法读取环境变量MODEL，请手动配置，报错{}",e)
    }

    let api_key_env=env::var("OPENAI_API_KEY");
    match api_key_env{
        Ok(value)=>println!("api_key为：{}",value),
        Err(e)=>println!("无法读取环境变量api_key，请手动配置")
    }
}

pub fn set_env_var(){
    print!("请输入你的OPEN_API_KEY：");
    //刷新缓冲区
    io::stdout().flush().expect("缓冲区刷新错误");
    //创建可变的string作为缓冲区
    let mut api_key=String::new();
    io::stdin().read_line(&mut api_key).expect("输入错误");
    let api_key=api_key.trim().to_string();
    if api_key.is_empty(){
        println!("输入为空，请重新输入")
    }else{
        unsafe {
            std::env::set_var("OPENAI_API_KEY", api_key);
        }
        println!("输入成功，成功设置API_KEY环境变量")
    }

    print!("请输入你选择的模型：");
    io::stdout().flush().expect("缓冲区刷新错误");
    //创建可变的string作为缓冲区
    let mut model=String::new();
    io::stdin().read_line(&mut model).expect("输入错误");
    let model=model.trim().to_string();
    if model.is_empty(){
        println!("输入为空，请重新输入")
    }else{
        unsafe {
            std::env::set_var("MODEL", model);
        }
        println!("输入成功，成功设置MODEL环境变量")
    }
}

#[cfg(test)]
mod tests{
    use super::*;

    #[test]
    fn test_set_env(){
        set_env_var();
        let api_key_env=env::var("OPENAI_API_KEY");
        let model_env=env::var("MODEL");
        assert!(api_key_env.is_ok());
        assert!(model_env.is_ok());
    }

    #[test]
    fn test_check_env(){
        check_env_var();
    }
}