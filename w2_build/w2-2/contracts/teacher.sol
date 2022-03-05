// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;


interface IScore{
    function setScore(address _student, uint256 _score, string memory class_name)external;
    function getScore(address _student, string memory class_name)external;
}


contract teacher{
    IScore public score_database;
    string public class_name;
    constructor(IScore _Score, string memory iclass_name){
        score_database = _Score;
        class_name = iclass_name;
    }
    function teacherSetScore(address _student,uint256 score) public{
        score_database.setScore(_student, score, class_name);
    }
    function teacherGetScore(address _student)  public{
        score_database.getScore(_student, class_name);
    }

}
