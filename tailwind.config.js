/** @type {import('tailwindcss').Config} */


const UIKitColors = {
  red: {
    light: '#FF3B30',
    dark: '#FF453A',
  },
  orange: {
    light: '#FF9500',
    dark: '#FF9F0A',
  },
  yellow: {
    light: '#FFCC00',
    dark: '#FFD60A',
  },
  green: {
    light: '#34C759',
    dark: '#30D158',
  },
  mint: {
    light: '#00C7BE',
    dark: '#63E6E2',
  },
  teal: {
    light: '#30B0C7',
    dark: '#40CBE0',
  },
  cyan: {
    light: '#32ADE6',
    dark: '#64D2FF',
  },
  blue: {
    light: '#007AFF',
    dark: '#0A84FF',
  },
  indigo: {
    light: '#5856D6',
    dark: '#5E5CE6',
  },
  purple: {
    light: '#AF52DE',
    dark: '#BF5AF2',
  },
  pink: {
    light: '#FF2D55',
    dark: '#FF375F',
  },
  brown: {
    light: '#A2845E',
    dark: '#AC8E68',
  },
  grey: {
    light: '#8E8E93',
    dark: '#8E8E93',
  },
  grey2: {
    light: '#AEAEB2',
    dark: '#636366',
  },
  grey3: {
    light: '#C7C7CC',
    dark: '#48484A',
  },
  grey4: {
    light: '#D1D1D6',
    dark: '#3A3A3C',
  },
  gray5: {
    light: '#E5E5EA',
    dark: '#2C2C2E',
  },
  grey6: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },

  // Separator
  separator: {
    opaque: {
      light: '#C6C6C8',
      dark: '#38383A',
    },
    non_opaque: {
      light: 'rgba(60, 60, 67, 0.36)',
      dark: 'rgba(84, 84, 88, 0.65)',
    },
  },

  // Label
  label: {
    primary: {
      dark: '#FFF',
      light: '#000',
    },
    secondary: {
      light: '#3C3C4399',
      dark: '#EBEBF599',
    },
    tertiary: {
      light: '#3C3C434D',
      dark: '#EBEBF54D',
    },
    quarternary: {
      light: '#3C3C432E',
      dark: '#EBEBF529',
    },
  },

  // Background
  background: {
    primary: {
      light: '#fff',
      dark: '#1C1C1E',
    },
    secondary: {
      light: '#F2F2F7',
      dark: '#2C2C2E',
    },
    tertiary: {
      light: '#FFFFFF',
      dark: '#3A3A3C',
    },
  },

  // Grouped Background
  grouped: {
    primary: {
      light: '#F2F2F7',
      dark: '#1C1C1E',
    },
    secondary: {
      light: '#FFFFFF',
      dark: '#2C2C2E',
    },
    tertiary: {
      light: '#F2F2F7',
      dark: '#3A3A3C',
    },
  },

  // Fill
  fill: {
    primary: {
      light: '#78788033',
      dark: '#7878805C',
    },
    secondary: {
      light: '#78788029',
      dark: '#78788052',
    },
    tertiary: {
      light: '#7676801F',
      dark: '#7676803D',
    },
    quarternary: {
      light: '#74748014',
      dark: '#7474802E',
    },
  },
}


module.exports = {
  // 这里给出了一份 taro 通用示例，具体要根据你自己项目的目录结构进行配置
  // 比如你使用 vue3 项目，你就需要把 vue 这个格式也包括进来
  // 不在 content glob表达式中包括的文件，在里面编写tailwindcss class，是不会生成对应的css工具类的
  content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  // 其他配置项 ...
  corePlugins: {
    // 小程序不需要 preflight，因为这主要是给 h5 的，如果你要同时开发多端，你应该使用 process.env.TARO_ENV 环境变量来控制它
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: 'system-ui,-apple-system,PingFang SC ,Segoe UI,Roboto,Helvetica,noto sans sc,hiragino sans gb,"sans-serif",Apple Color Emoji,Segoe UI Emoji,Not Color Emoji',
        serif:
          '"Noto Serif CJK SC","Noto Serif SC",var(--font-serif),"Source Han Serif SC","Source Han Serif",source-han-serif-sc,SongTi SC,SimSum,"Hiragino Sans GB",system-ui,-apple-system,Segoe UI,Roboto,Helvetica,"Microsoft YaHei","WenQuanYi Micro Hei",sans-serif',
        mono: `"OperatorMonoSSmLig Nerd Font","Cascadia Code PL","FantasqueSansMono Nerd Font","operator mono",JetBrainsMono,"Fira code Retina","Fira code","Consolas", Monaco, "Hannotate SC", monospace, -apple-system`,
      },
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },

        'w-screen': '100vw',
        'h-screen': '100vh',
      },
      maxWidth: {
        screen: '100vw',
      },
      width: {
        screen: '100vw',
      },
      height: {
        screen: '100vh',
      },
      maxHeight: {
        screen: '100vh',
      },

      colors: {
        uk: UIKitColors,

        themed: {
          bg_opacity: 'var(--bg-opacity)',
        },
      },
    },
  },
}



