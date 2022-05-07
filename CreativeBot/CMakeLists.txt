cmake_minimum_required(VERSION 3.00)

# Set project name
project(CreativeBot)

# C++20 standard needs to be explicitely set
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_executable(CreativeBot Main.cpp)