angular.module('y86', ['ngRoute']).controller('mainCtrl', ['$scope', mainCtrl]).filter("toHex", function () {
    return function (input, digest) {
        if (typeof input == 'undefined' || input === null) {
            return '';
        }
        if (input < 0) {
            input = 0xFFFFFFFF + input + 1;
        }
        var ret = input.toString(16);
        while (ret.length < digest) {
            ret = '0' + ret;
        }
        return ret;
    };
}).filter("round", function () {
    return function (input) {
        return Math.round(input * 1000) / 1000 || 0;
    };
});

function mainCtrl($scope) {
    var Constant = require('script/kernels/constant');
    var Parser   = require('script/kernels/parser');

    $scope.constantMap = {
        stat:  {
            0: 'STAT_BUB',
            1: 'STAT_AOK',
            2: 'STAT_HLT',
            3: 'STAT_ADR',
            4: 'STAT_INS',
            5: 'STAT_PIP'
        },
        icode: {
            0:   'I_HALT',
            1:   'I_NOP',
            2:   'I_RRMOVQ',
            3:   'I_IRMOVQ',
            4:   'I_RMMOVQ',
            5:   'I_MRMOVQ',
            6:   'I_OPQ',
            7:   'I_JXX',
            8:   'I_CALL',
            9:   'I_RET',
            0xa: 'I_PUSHQ',
            0xb: 'I_POPQ',
            0xc: 'I_IADDQ',
            0xd: 'I_LEAVE'
        },
        reg: {
            0: 'R_RAX',
            1: 'R_RCX',
            2: 'R_RDX',
            3: 'R_RBX',
            4: 'R_RSP',
            5: 'R_RBP',
            6: 'R_RSI',
            7: 'R_RDI',
            8: 'R_R8',
            9: 'R_R9',
            0xa: 'R_R10',
            0xb: 'R_R11',
            0xc: 'R_R12',
            0xd: 'R_R13',
            0xe: 'R_R14',
            15: 'R_NONE'
        }
    };

    $scope.$safeApply = function () {
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    $scope.state = {
        icons:  ['play', 'pause'],
        icon:   0,
        loaded: 0
    };

    $scope.registers = {
        rax: 0,
        rcx: 0,
        rdx: 0,
        rbx: 0,
        rsp: 0,
        rbp: 0,
        rsi: 0,
        rdi: 0,
        r8: 0,
        r9: 0,
        r10: 0,
        r11: 0,
        r12: 0,
        r13: 0,
        r14: 0
    };

    $scope.memory = {
        data:  [],
        block: []
    };

    $scope.conditions = {
        zf: 0,
        sf: 0,
        of: 0
    };

    $scope.clock = {
        data: 0
    };

    $scope.code = {
        current:      0,
        height:       0,
        scrollTop:    0,
        scrollHeight: 0,
        lineHeight:   14 * 1.2,
        currentTab:   0,
        tabs:         ['asum', 'List_Sum', 'Forward'],
        tabFiles:     ['test/asum.yo', 'test/List_Sum.yo', 'test/Forward.yo'],
        fileCache:    ['', '', '']
    };

    $scope.player = {
        hz: 10
    };

    // Functions

    $scope.initParser = function (parser) {
        if ($scope.parser && $scope.parser !== parser)
            delete $scope.parser;

        $scope.parser      = parser;
        $scope.code.lines  = parser.syntaxs;
        $scope.clock.data  = parser.CPU.cycle;
        $scope.memory.data = parser.CPU.Memory.data;

        // Clock Cycle
        $scope.$watch('parser.CPU.cycle', function (clock) {
            $scope.clock.data = clock;
        });

        // Registers
        $scope.$watch('parser.CPU.Register[' + Constant['R_RAX'] + ']', function (value) {
            $scope.registers['rax'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_RCX'] + ']', function (value) {
            $scope.registers['rcx'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_RDX'] + ']', function (value) {
            $scope.registers['rdx'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_RBX'] + ']', function (value) {
            $scope.registers['rbx'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_RSP'] + ']', function (value) {
            $scope.registers['rsp'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_RBP'] + ']', function (value) {
            $scope.registers['rbp'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_RSI'] + ']', function (value) {
            $scope.registers['rsi'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_RDI'] + ']', function (value) {
            $scope.registers['rdi'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_R8'] + ']', function (value) {
            $scope.registers['r8'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_R9'] + ']', function (value) {
            $scope.registers['r9'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_R10'] + ']', function (value) {
            $scope.registers['r10'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_R11'] + ']', function (value) {
            $scope.registers['r11'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_R12'] + ']', function (value) {
            $scope.registers['r12'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_R13'] + ']', function (value) {
            $scope.registers['r13'] = value;
        });
        $scope.$watch('parser.CPU.Register[' + Constant['R_R14'] + ']', function (value) {
            $scope.registers['r14'] = value;
        });


        // PC
        $scope.$watch('parser.CPU.Input.F_predPC', function (value) {
            $scope.code.current = $scope.parser.map[value] || $scope.code.current;
        });

        // Condition Codes
        $scope.$watch('parser.CPU.ALU.data.ZF', function (value) {
            $scope.conditions.zf = value;
        });
        $scope.$watch('parser.CPU.ALU.data.SF', function (value) {
            $scope.conditions.sf = value;
        });
        $scope.$watch('parser.CPU.ALU.data.OF', function (value) {
            $scope.conditions.of = value;
        });

        $scope.$watch('code.current', function (value) {
            var cursorPos = value * $scope.code.lineHeight;
            while (cursorPos >= $scope.code.height + $scope.code.scrollTop) {
                $scope.code.scrollTop += $scope.code.height;
            }
            while (cursorPos <= $scope.code.scrollTop) {
                $scope.code.scrollTop -= $scope.code.height;
            }
            $scope.code.scrollTop = Math.min($scope.code.scrollTop, $scope.code.scrollHeight - $scope.code.height);
            $scope.code.scrollTop = Math.max($scope.code.scrollTop, 0);
        });
    };

    $scope.loadTab = function (index) {
        $scope.code.currentTab = index;
        $scope.reset();
    };

    $scope.newTab = function (files) {
        var readFile = function (index) {
            if (!files[index])
                return;
            if (files[index].name.split('.')[1] !== 'yo') {
                alert('File type is not supported!');
                return;
            }
            $scope.code.tabs.push(files[index].name.split('.')[0]);
            var reader = new FileReader();
            reader.onload = function(event) {
                $scope.code.fileCache.push(event.target.result);
                $scope.$safeApply();
                readFile(index + 1);
            };
            reader.readAsText(files[index]);
        };
        readFile(0);
    };

    $scope.prev = function () {
        if (!$scope.parser) {
            return false;
        }
        if ($scope.state.icon) {
            // Pause here
            $scope.play();
        }
        $scope.parser.CPU.backword();
    };

    $scope.next = function () {
        if (!$scope.parser) {
            return false;
        }
        try {
            $scope.parser.CPU.forward();
        } catch (err) {
            return false;
        }
        return true;
    };

    $scope.setInterval = function () {
        if (!$scope.state.icon) {
            return false;
        }
        if (!$scope.next()) {
            $scope.state.icon = 0;
            $scope.$safeApply();
            return false;
        }
        $scope.$safeApply();
        setTimeout($scope.setInterval, 1000 / $scope.player.hz);
        return true;
    };

    $scope.play = function () {
        $scope.state.icon ^= 1;

        if ($scope.state.icon) {
            if (!$scope.parser) {
                // test
                var parser = new Parser($scope.code.fileCache[$scope.code.currentTab] || ($scope.code.fileCache[$scope.code.currentTab] = xhrGETSync($scope.code.tabFiles[$scope.code.currentTab])));

                $scope.initParser(parser);
                $scope.setInterval();
            } else {
                $scope.setInterval();
            }
        }
    };

    $scope.reset = function () {
        if ($scope.state.icon) {
            // Pause here
            $scope.play();
        }

        var parser = new Parser($scope.code.fileCache[$scope.code.currentTab] || ($scope.code.fileCache[$scope.code.currentTab] = xhrGETSync($scope.code.tabFiles[$scope.code.currentTab])));

        $scope.initParser(parser);
    };

    // Initialization

    setTimeout(function () {
        $scope.reset();
        $scope.$safeApply();
    }, 0);

    move.select = function (element) {
        return element;
    };
}
