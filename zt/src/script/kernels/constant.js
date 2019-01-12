/**
 * Created by shuding on 6/9/15.
 * <ds303077135@gmail.com>
 */

module.exports = {

    REGISTERS: [
        'R_RAX',
        'R_RCX',
        'R_RDX',
        'R_RBX',
        'R_RSP',
        'R_RBP',
        'R_RSI',
        'R_RDI',
        'R_R8',
        'R_R9',
        'R_R10',
        'R_R11',
        'R_R12',
        'R_R13',
        'R_R14'
    ],

    P_LOAD:   0,
    P_STALL:  1,
    P_BUBBLE: 2,
    P_ERROR:  3,

    I_NOP:    0,
    I_HALT:   1,
    I_RRMOVQ: 2,
    I_IRMOVQ: 3,
    I_RMMOVQ: 4,
    I_MRMOVQ: 5,
    I_OPQ:    6,
    I_JXX:    7,
    I_CALL:   8,
    I_RET:    9,
    I_PUSHQ:  0xa,
    I_POPQ:   0xb,
    I_IADDQ:  0xc,
    I_LEAVE:  0xd,

    A_ADD:  0,
    A_SUB:  1,
    A_AND:  2,
    A_XOR:  3,
    A_NONE: 4,

    F_OF: 1, // OF at bit 0
    F_SF: 2, // SF at bit 1
    F_ZF: 4, // ZF at bit 2

    C_TRUE: 0,
    C_LE:   1,
    C_L:    2,
    C_E:    3,
    C_NE:   4,
    C_GE:   5,
    C_G:    6,

    STAT_BUB: 0,
    STAT_AOK: 1,
    STAT_HLT: 2,
    STAT_ADR: 3,
    STAT_INS: 4,
    STAT_PIP: 5,

    R_RAX:  0,
    R_RCX:  1,
    R_RDX:  2,
    R_RBX:  3,
    R_RSP:  4,
    R_RBP:  5,
    R_RSI:  6,
    R_RDI:  7,
    R_R8:  8,
    R_R9:  9,
    R_R10:  0xa,
    R_R11:  0xb,
    R_R12:  0xc,
    R_R13:  0xd,
    R_R14:  0xe,
    R_NONE: 0xf,

    DEF_CC: 4
};
